import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const connectionString = process.env.DATABASE_URL!;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const FAQ_DATA = [
  {
    category: 'Policy',
    content: 'Returns are accepted within 30 days with a receipt.',
  },
  {
    category: 'Shipping',
    content: 'We ship to the USA, Canada, and UK within 5-7 business days.',
  },
  {
    category: 'Support',
    content: 'Contact us at support@spur.com or call 1-800-SPUR.',
  },
];

function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map((v) => v / magnitude);
}

async function main() {
  console.log('🌱 Starting Seed...');

  for (const item of FAQ_DATA) {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: [item.content],
      config: { outputDimensionality: 768 },
    });

    if (!response.embeddings?.[0]?.values) {
      throw new Error('Failed to generate embedding');
    }

    const vector = normalize(response.embeddings[0].values);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Knowlagebase" (id, content, category, embedding)
       VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
      item.content,
      item.category,
      `[${vector.join(',')}]`,
    );
  }

  console.log('✅ Seed Finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
