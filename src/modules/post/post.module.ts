import { Module } from '@nestjs/common';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';
import { PostController } from './controller/post.controller';
import { PostService } from './controller/post.service';
import { HttpModule } from '@nestjs/axios';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';

@Module({
  imports: [HttpModule, PostRepositoryModule],
  controllers: [PostController],
  providers: [PostService, MetaDataExtractor],
})
export class PostModule {}
