import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { UserHistory } from './user-history.entity';

@Injectable()
export class UserHistoryRepository extends GenericTypeOrmRepository<UserHistory> {
  getName(): EntityTarget<UserHistory> {
    return UserHistory.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(UserHistory);
  }
}
