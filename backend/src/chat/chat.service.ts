import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // get the chat
  async getChatResponse(userPrompt: string, sessionId: string) {
    try {
      // geneare user query vector
      const [userQueryVector] = await this.aiService.generateEmbedding([
        userPrompt,
      ]);

      // getting the relevent vector from teh pgVector
      const context = await this.prisma.$queryRaw<{ content: string }[]>`
      SELECT content
      FROM "KnowledgeChunk"
      ORDER BY 1 - (embedding <=> ${`[${userQueryVector.join(',')}]`}::vector) DESC
      LIMIT 3
    `;

      // getting the releveant content for vector
      const contextText = context.map((c) => c.content).join('\n\n');

      // retriveing theh chat histroy /
      const history = await this.redis.lrange(`chat:${sessionId}`, -10, -1);

      const chatHistory = history
        .map((h) => JSON.parse(h))
        .map((msg) => `user: ${msg.user}\n ai: ${msg.ai}`)
        .join('\n\n');

      // now chatting withh LLLM to get the response
      const aiResponse = await this.aiService.generateChatResponse({
        context: contextText,
        userPrompt,
        chatHistory,
      });

      // new response back to redis
      const chatPair = JSON.stringify({
        user: userPrompt,
        ai: aiResponse,
        timestamp: new Date().toISOString(),
      });

      await this.redis.rpush(`chat:${sessionId}`, chatPair);
      await this.redis.expire(`chat:${sessionId}`, 10 * 60); // expiry after 10 minutes

      return { response: aiResponse };
    } catch (error) {
      console.error('Error in getChatResponse:', error);
      throw new InternalServerErrorException(
        'Failed to generate chat response',
      );
    }
  }
  // Persist Redis chat history to PostgreSQL
  async persistSessionToDb(sessionId: string) {
    try {
      const rawHistory = await this.redis.lrange(`chat:${sessionId}`, 0, -1);

      if (rawHistory.length === 0) {
        return { message: 'No history to persist' };
      }

      const messages = rawHistory.map((h) => JSON.parse(h));

      // Prepare messages for database
      const messagesToCreate = messages.flatMap((msg) => [
        { sender: 'user', text: msg.user },
        { sender: 'ai', text: msg.ai },
      ]);

      // Bulk insert into Postgres
      await this.prisma.conversation.upsert({
        where: { id: sessionId },
        update: {
          messages: {
            createMany: {
              data: messagesToCreate,
            },
          },
        },
        create: {
          id: sessionId,
          messages: {
            createMany: {
              data: messagesToCreate,
            },
          },
        },
      });

      // Cleanup Redis after persisting
      await this.redis.del(`chat:${sessionId}`);

      return { message: 'Session persisted successfully' };
    } catch (error) {
      console.error('Error persisting session to DB:', error);
      throw new InternalServerErrorException('Failed to persist session');
    }
  }

  // get chat history
  async getChatHistory(sessionId: string) {
    try {
      const rawHistory = await this.redis.lrange(`chat:${sessionId}`, 0, -1);
      if (rawHistory.length > 0) {
        const message = rawHistory.map((h) => JSON.parse(h));
        console.log('Chat history retrieved from Redis:', message);
        return message.flatMap((msg) => [
          { sender: 'user', text: msg.user },
          { sender: 'ai', text: msg.ai },
        ]);
      }

      return [];
    } catch (error) {
      console.error('Error in fetching chat history:', error);
      return [];
    }
  }
}
