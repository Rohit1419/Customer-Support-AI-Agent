import { Module } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';

@Module({
  imports: [PrismaService, AiService],
  providers: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
