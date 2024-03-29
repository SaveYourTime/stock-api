import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  Logger,
  ValidationPipe,
  INestApplication,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

const {
  PORT = 80,
  ACCESS_CONTROL_ALLOW_ORIGIN = '*',
  ACCESS_CONTROL_ALLOW_CREDENTIALS = 'true',
} = process.env;

const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Stock')
    .setDescription('The stock API description')
    .setVersion('1.0')
    .addCookieAuth('token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: ACCESS_CONTROL_ALLOW_ORIGIN,
    credentials: ACCESS_CONTROL_ALLOW_CREDENTIALS === 'true',
  });
  setupSwagger(app);
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && req.url === '/') {
      return res.status(200).send('<h1>Hello World!</h1>');
    }
    next();
  });

  await app.listen(PORT);

  const logger = new Logger('bootstrap');
  const URL = await app.getUrl();
  logger.log(`Application is running on: ${URL}`);
  logger.log(`Swagger is running on: ${URL}/api`);
  logger.log(`Accepting requests from origin: "${ACCESS_CONTROL_ALLOW_ORIGIN}"`);
}
bootstrap();
