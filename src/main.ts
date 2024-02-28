import { NestFactory } from '@nestjs/core';
import { Modules } from './modules';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TogetherConfigService } from './core/config/config.service';
import { setNestApp } from './setNestApp';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(Modules);
  const configService = app.get(TogetherConfigService);
  const appConfig = configService.getAppConfig();

  setNestApp(app);

  await app.listen(appConfig.PORT);
  Logger.log(`🧐 [TOGETHER-API][${appConfig.ENV}] Started at: ${Date.now()}`);
  Logger.log(`🚀 Server open at ${appConfig.BASE_URL}:${appConfig.PORT}`);
}
bootstrap();
