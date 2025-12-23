import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async ingestData(content: string, category: string) {
    const vector = await this.aiService.generateEmbedding(content);

    return this.prisma.$executeRawUnsafe(
      `INSERT INTO "KnowlageBase" (id, content, category, embedding) VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
      content,
      category,
      `[${vector.join(',')}]`,
    );
  }
}
