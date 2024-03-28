import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Scrap } from './scrap.entity';

@Injectable()
export class ScrapRepository extends GenericTypeOrmRepository<Scrap> {
  getName(): EntityTarget<Scrap> {
    return Scrap.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Scrap);
  }
}
