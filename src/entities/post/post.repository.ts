import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends GenericTypeOrmRepository<Post> {
  getName(): EntityTarget<Post> {
    return Post.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Post);
  }
}
