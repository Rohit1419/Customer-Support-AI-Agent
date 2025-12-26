import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;

  constructor(private config: ConfigService) {
    this.genAI = new GoogleGenAI({
      apiKey: this.config.get('GEMINI_API_KEY'),
    });
  }
  // normalising the embedding
  private normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0),
    );
    if (magnitude === 0) {
      throw new Error('Cannot normalize a zero vector');
    }
    return vector.map((val) => val / magnitude);
  }

  //    generating the embedding for the given content
  async generateEmbedding(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }
    try {
      const response = await this.genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: texts,
        config: {
          outputDimensionality: 768,
        },
      });

      const embeddings = response.embeddings;

      if (!embeddings || embeddings.length === 0 || !embeddings[0].values) {
        throw new Error('Failed to generate embedding');
      }

      return embeddings.map((emb) => {
        if (!emb.values) {
          throw new Error('Embedding values missing');
        }
        return this.normalize(emb.values);
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to generate embeddings, please try again later.',
        { cause: error },
      );
    }
  }

  // generate the chat resposne
  async generateChatResponse(params: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
  }): Promise<string> {
    try {
      const chatResponse = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [{ role: 'user', parts: [{ text: params.userPrompt }] }],
        config: {
          systemInstruction: params.systemPrompt,
          temperature: params.temperature ?? 0.7,
          maxOutputTokens: 1000, // check for optimal value to tune according to practical usages
        },
      });

      if (!chatResponse || !chatResponse.text) {
        throw new Error('Failed to generate chat response');
      }

      return chatResponse.text;
    } catch (error) {
      if (error.status === 429) {
        throw new ServiceUnavailableException(
          'The AI helper is little busy now, please wait a moment and try again.',
        );
      }

      throw new ServiceUnavailableException(
        'I am having trouble thinking right now, please try again later.',
      );
    }
  }
}
