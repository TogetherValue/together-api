import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { HttpModule } from '@nestjs/axios';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { ScrapRepositoryModule } from 'src/entities/scrap/scrap-repository.module';
import { IpMiddleware } from 'src/core/middleware/ip.middleware';
import { UserHistoryRepositoryModule } from 'src/entities/user-history/user-history-repository.module';

@Module({
  imports: [
    HttpModule,
    PostRepositoryModule,
    ScrapRepositoryModule,
    UserHistoryRepositoryModule,
  ],
  controllers: [PostController],
  providers: [PostService, MetaDataExtractor],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)
      .exclude(
        {
          path: 'posts',
          method: RequestMethod.POST,
        },
        {
          path: 'posts',
          method: RequestMethod.DELETE,
        },
      )
      .forRoutes(PostController);
  }
}
