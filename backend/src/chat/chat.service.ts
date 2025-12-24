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

    const userQueryVector = await this.aiService.generateEmbedding(userPrompt);

    // getting the relevent vector from teh pgVector

    const context: any[] = await this.prisma.$queryRawUnsafe(
      `
      SELECT content
      FROM "Knowlagebase"
      ORDER BY 1 - (embedding <=> $1::vector) DESC
      LIMIT 3
    `,
      `[${userQueryVector.join(',')}]`,
    );
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

    return { response: aiResponse };
  }
}
