import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import matter from 'gray-matter';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async ingestMarkDownFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    if (path.extname(filePath) !== '.md') {
      throw new Error(`Not a markdown file: ${filePath}`);
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: metadata, content: rawFileContent } = matter(fileContent);

    const textsplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });

    const chunks = await textsplitter.createDocuments([rawFileContent]);
    const chunkContents = chunks.map((chunk) => chunk.pageContent);

    // generate embedding
    const vectors = await this.aiService.generateEmbedding(chunkContents);

    // batch insert
    for (let i = 0; i < chunkContents.length; i++) {
      const content = chunkContents[i];
      const vectorStr = `[${vectors[i].join(',')}]`;

      await this.prisma.$executeRaw`
      INSERT INTO "KnowledgeChunk"
      (id, content, "sourceFile", "sourceType", priority, embedding, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${content},
        ${filePath},
        ${metadata.category ?? 'general'},
        ${metadata.priority ?? 0},
        ${vectorStr}::vector,
        NOW(),
        NOW()
      )
    `;
    }

    console.log(
      `Processed and stored chunks from file: ${filePath} and created (${chunkContents.length} chunks)`,
    );
  }
}
