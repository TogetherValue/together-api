import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { WinstonConfigService } from './logger/winston-config.service';
import { WinstonModule } from 'nest-winston';
import { TransactionManager } from './database/typeorm/transaction.manager';
import { TransactionMiddleware } from './middleware/transaction.middleware';

const modules = [ConfigModule];
const providers = [TransactionManager];

@Global()
@Module({
  imports: [
    getTypeOrmModule(),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    ...modules,
  ],
  providers: [...providers],
  exports: [...modules],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
