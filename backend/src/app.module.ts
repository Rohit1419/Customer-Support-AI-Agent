import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AiModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
