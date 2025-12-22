import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const connectionString = config.get('DATABASE_URL')!;
    const adapter = new PrismaPg({ connectionString });

    console.log('db connecting to', connectionString);

    super({ adapter });
  }
}
