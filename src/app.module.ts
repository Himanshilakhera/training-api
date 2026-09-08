import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().integer().default(3000),

        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        API_PREFIX: Joi.string().required(),
      }),
    }),
    ProductsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
