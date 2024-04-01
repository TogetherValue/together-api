import { Module } from '@nestjs/common';
import { ScrapRepository } from './scrap.repository';

@Module({
  providers: [ScrapRepository],
  exports: [ScrapRepository],
})
export class ScrapRepositoryModule {}
