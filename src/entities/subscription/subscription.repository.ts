import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { GetSubscriptionsWithUser, Subscription } from './subscription.entity';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { IUser } from 'types/user/common';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';
import { plainToInstance } from 'class-transformer';
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
  ): Promise<PaginationResponse<GetSubscriptionsWithUser>> {
    const { page, take } = getSubscriptionsQueryDto;

    const [data, total] = await Promise.all([
      this.getRepository().find({
        where: { subscriberId: userId },
        skip: (page - 1) * take,
        take,
        relations: ['TargetUser'],
      }),
      this.getRepository().count(),
    ]);

    return new PaginationBuilder<GetSubscriptionsWithUser>()
      .setData(plainToInstance(GetSubscriptionsWithUser, data))
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }
}
