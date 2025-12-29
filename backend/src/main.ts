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
  const CLIENT_URL = process.env.CLIENT_URL;
  app.enableCors({
    origin: 'CLIENT_URL',
    methods: ['GET', 'POST'],
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
