import { Module } from '@nestjs/common';
import { ScrapRepositoryModule } from 'src/entities/scrap/scrap-repository.module';
import { ScrapController } from './controller/scrap.controller';
import { ScrapService } from './service/scrap.service';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';

@Module({
  imports: [ScrapRepositoryModule, PostRepositoryModule],
  controllers: [ScrapController],
  providers: [ScrapService],
})
export class ScrapModule {}
