import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are passed
      transform: true, // Automatically transform payloads to match DTO instance types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
