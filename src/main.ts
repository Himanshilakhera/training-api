import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

   const apiPrefix = configService.get<string>(
    'API_PREFIX',
    'api/v1',
  );

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are passed
      transform: true, // Automatically transform payloads to match DTO instance types
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
  new LoggingInterceptor(),
  new TransformInterceptor(),
);
  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
