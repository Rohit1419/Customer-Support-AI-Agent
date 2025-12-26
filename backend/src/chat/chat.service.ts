import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  // get the chat

  async generateChatResponse(userPrompt: string, sessionId: string) {
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

    const systemPrompt = `You are a helpful Spur support agent.
        Use the following context to answer questions.
        If unsure, say you don't know.

        Context:
        ${contextText}`;

    // now chatting withh LLLM to get the response
    const aiResponse = await this.aiService.generateChatResponse({
      systemPrompt,
      userPrompt,
    });

    // updating the conversaton history
    try {
      await this.prisma.conversation.upsert({
        where: { id: sessionId },
        update: {
          messages: {
            create: [
              { sender: 'user', text: userPrompt },
              { sender: 'ai', text: aiResponse },
            ],
          },
        },
        create: {
          id: sessionId,
          messages: {
            create: [
              { sender: 'user', text: userPrompt },
              { sender: 'ai', text: aiResponse },
            ],
          },
        },
      });
    } catch (error) {
      console.error('Error updating conversation history:', error);
    }

    return { response: aiResponse };
  }
}
