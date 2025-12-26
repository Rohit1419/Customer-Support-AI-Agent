import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { KnowledgeBaseService } from '../src/knowledge/knowledge.service';
import * as path from 'path';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const knowledgeService = app.get(KnowledgeBaseService);

  try {
    // 👇 YOU control exactly which file gets ingested
    const filePath = path.join(
      process.cwd(),
      'src/knowledge/sources/auth/jwt.md',
    );

    await knowledgeService.ingestMarkdownFile(filePath);
    console.log('✅ File ingestion complete');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
