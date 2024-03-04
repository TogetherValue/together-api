import { Module } from '@nestjs/common';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';
import { PostController } from './controller/post.controller';
import { PostService } from './controller/post.service';

@Module({
  imports: [PostRepositoryModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
