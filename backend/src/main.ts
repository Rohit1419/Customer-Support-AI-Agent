import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // checking the validation pipes for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //cors
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
