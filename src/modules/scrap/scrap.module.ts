import { Module } from '@nestjs/common';
import { ScrapRepositoryModule } from 'src/entities/scrap/scrap-repository.module';
import { ScrapController } from './controller/scrap.controller';
import { ScrapService } from './service/scrap.service';

@Module({
  imports: [ScrapRepositoryModule],
  controllers: [ScrapController],
  providers: [ScrapService],
})
export class ScrapModule {}
