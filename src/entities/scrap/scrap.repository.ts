import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget, In } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Scrap } from './scrap.entity';
import { IUser } from 'types/user/common';
import { IPost } from 'types/post/common';

@Injectable()
export class ScrapRepository extends GenericTypeOrmRepository<Scrap> {
  getName(): EntityTarget<Scrap> {
    return Scrap.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Scrap);
  }

  getSubscriptionsByUserIdAndPostIds(
    userId: IUser['id'],
    postIds: Array<IPost['id']>,
  ) {
    return this.getRepository().find({
      where: {
        userId,
        postId: In(postIds),
      },
    });
  }
}
