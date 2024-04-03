import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { GetUserHistory, UserHistory } from './user-history.entity';
import { IUser } from 'types/user/common';
import { GetUserHistoryQueryDto } from 'src/common/request/user/get-userHistory.query.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserHistoryRepository extends GenericTypeOrmRepository<UserHistory> {
  getName(): EntityTarget<UserHistory> {
    return UserHistory.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(UserHistory);
  }

  async getUserHistory(
    getUserHistoryQueryDto: GetUserHistoryQueryDto,
    userId: IUser['id'],
  ) {
    const results = await this.paginate(getUserHistoryQueryDto, {
      where: { userId },
      relations: { Post: { Writer: true } },
      order: { viewedAt: 'DESC' },
    });

    results.list = results.list.map((res) =>
      plainToInstance(GetUserHistory, res),
    );

    return results;
  }
}
