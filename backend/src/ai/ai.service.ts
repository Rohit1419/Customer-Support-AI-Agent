import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;
  constructor(private config: ConfigService) {
    this.genAI = new GoogleGenAI({
      apiKey: this.config.get('GOOGLE_API_KEY'),
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
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.genAI.models.embedContent({
      model: 'gemini-embedding-001',
      contents: [text],
      config: {
        outputDimensionality: 768,
      },
    });

    const embeddings = response.embeddings;

    if (!embeddings || embeddings.length === 0 || !embeddings[0].values) {
      throw new Error('Failed to generate embedding');
    }

    return this.normalize(embeddings[0].values);
  }
}
