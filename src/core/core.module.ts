import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';

const modules = [ConfigModule];

@Global()
@Module({
  imports: [...modules],
  providers: [],
  exports: [...modules],
})
export class CoreModule {}
