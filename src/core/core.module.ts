import {
  ClassProvider,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { WinstonConfigService } from './logger/winston-config.service';
import { WinstonModule } from 'nest-winston';
import { TransactionManager } from './database/typeorm/transaction.manager';
import { TransactionMiddleware } from './middleware/transaction.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { ApiResponseInterceptor } from './interceptor/apiResponse.interceptor';
import { JWTModule } from './jwt/jwt.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

const modules = [ConfigModule, JWTModule];
const providers = [TransactionManager];
const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
];

@Global()
@Module({
  imports: [
    getTypeOrmModule(),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    ...modules,
  ],
  providers: [...providers, ...interceptors],
  exports: [...modules, ...providers],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
