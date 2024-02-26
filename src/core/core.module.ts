import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';

const modules = [ConfigModule];

@Global()
@Module({
  imports: [getTypeOrmModule(), ...modules],
  providers: [],
  exports: [...modules],
})
export class CoreModule {}
