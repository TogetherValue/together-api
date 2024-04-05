import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionRepository extends GenericTypeOrmRepository<Subscription> {
  getName(): EntityTarget<Subscription> {
    return Subscription.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Subscription);
  }
}
