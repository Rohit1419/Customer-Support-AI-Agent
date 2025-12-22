import { Module } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';

@Module({
  providers: [KnowledgeBaseService]
})
export class KnowledgeBaseModule {}
