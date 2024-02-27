import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { WinstonConfigService } from './logger/winston-config.service';
import { WinstonModule } from 'nest-winston';

const modules = [ConfigModule];

@Global()
@Module({
  imports: [
    getTypeOrmModule(),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    ...modules,
  ],
  providers: [],
  exports: [...modules],
})
export class CoreModule {}
