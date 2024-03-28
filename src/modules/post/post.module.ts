import { Module } from '@nestjs/common';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { HttpModule } from '@nestjs/axios';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { ScrapRepositoryModule } from 'src/entities/scrap/scrap-repository.module';

@Module({
  imports: [HttpModule, PostRepositoryModule, ScrapRepositoryModule],
  controllers: [PostController],
  providers: [PostService, MetaDataExtractor],
})
export class PostModule {}
