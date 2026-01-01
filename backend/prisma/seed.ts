import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import matter from 'gray-matter';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

/* ---------- Setup ---------- */

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/* ---------- Helpers ---------- */

function normalize(vector: number[]): number[] {
  const mag = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  return vector.map((v) => v / mag);
}

/* ---------- Seed Logic ---------- */

async function ingestMarkdownFile(filePath: string) {
  console.log(`📄 Ingesting ${filePath}`);

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: metadata, content } = matter(raw);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments([content]);
  const texts = docs.map((d) => d.pageContent);

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: texts,
    config: { outputDimensionality: 768 },
  });

  if (!response.embeddings) {
    throw new Error('Embedding generation failed');
  }

  for (let i = 0; i < texts.length; i++) {
    const vector = normalize(response.embeddings[i].values!);

    await prisma.$executeRaw`
      INSERT INTO "KnowledgeChunk"
      (
        id,
        content,
        "sourceFile",
        "sourceType",
        priority,
        embedding,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        gen_random_uuid(),
        ${texts[i]},
        ${filePath},
        ${metadata.category ?? 'general'},
        ${metadata.priority ?? 0},
        ${`[${vector.join(',')}]`}::vector,
        NOW(),
        NOW()
      )
    `;
  }

  console.log(`✅ Inserted ${texts.length} chunks`);
}

/* ---------- Entry ---------- */

async function main() {
  const file = path.resolve(process.cwd(), 'knowledgeData/Warranty.md');
  if (!file) {
    throw new Error('Usage: seed-knowledge <markdown-file>');
  }

  await ingestMarkdownFile(file);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
