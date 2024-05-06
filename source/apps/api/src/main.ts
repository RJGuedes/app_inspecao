/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as bodyParser from 'body-parser';
import { join } from 'path';

// Security modules
import * as helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { staticPath } from './app/config/path';
// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.use(helmet());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  console.log({ staticPath });
  app.useStaticAssets(staticPath, { prefix: '/files' });

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
