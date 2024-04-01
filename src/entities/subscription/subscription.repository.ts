import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Subscription } from './subscription.entity';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { IUser } from 'types/user/common';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';
import { PaginationResponse } from 'src/common/pagination/pagination.response';

@Injectable()
export class SubscriptionRepository extends GenericTypeOrmRepository<Subscription> {
  getName(): EntityTarget<Subscription> {
    return Subscription.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Subscription);
  }

  async getSubscriptions(
    getSubscriptionsQueryDto: GetSubscriptionsQueryDto,
    userId: IUser['id'],
  ): Promise<PaginationResponse<Subscription>> {
    const { page, take } = getSubscriptionsQueryDto;

    const [data, total] = await Promise.all([
      this.getQueryBuilder()
        .select('subscription.subscriberId')
        .leftJoin('subscription.TargetUser', 'targetUser')
        .addSelect([
          'targetUser.id',
          'targetUser.avatarUrl',
          'targetUser.githubUrl',
          'targetUser.nickname',
          'targetUser.introduction',
          'targetUser.createdAt',
          'targetUser.deletedAt',
          'targetUser.updatedAt',
        ])
        .where('subscription.subscriber_id = :userId', { userId })
        .getMany(),
      this.getRepository().count(),
    ]);

    return new PaginationBuilder<Subscription>()
      .setData(data)
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }
}
