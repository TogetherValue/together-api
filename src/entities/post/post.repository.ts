import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Post, PostWithWriter } from './post.entity';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';
import { plainToInstance } from 'class-transformer';
import { PaginationResponse } from 'src/common/pagination/pagination.response';

@Injectable()
export class PostRepository extends GenericTypeOrmRepository<Post> {
  getName(): EntityTarget<Post> {
    return Post.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Post);
  }

  async getPostsWithWriter(
    getPostsQueryDto: GetPostsQueryDto,
  ): Promise<PaginationResponse<PostWithWriter>> {
    const { page, take } = getPostsQueryDto;

    const [data, total] = await Promise.all([
      this.getRepository().find({
        relations: ['Writer'],
        skip: (page - 1) * take,
        take,
      }),
      this.getRepository().count(),
    ]);

    return new PaginationBuilder<PostWithWriter>()
      .setData(plainToInstance(PostWithWriter, data))
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }
}
