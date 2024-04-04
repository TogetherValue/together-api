import { Injectable } from '@nestjs/common';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { EntityTarget, In } from 'typeorm';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { GetUserScraps, Scrap } from './scrap.entity';
import { IUser } from 'types/user/common';
import { IPost } from 'types/post/common';
import { GetUserHistoryQueryDto } from 'src/common/request/user/get-userHistory.query.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationResponse } from 'src/common/pagination/pagination.response';

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

  async getUserScraps(
    getUserHistoryQueryDto: GetUserHistoryQueryDto,
    userId: IUser['id'],
  ): Promise<PaginationResponse<GetUserScraps>> {
    const results = await this.paginate(getUserHistoryQueryDto, {
      where: { userId },
      relations: { Post: { Writer: true } },
      order: { createdAt: 'DESC' },
    });

    results.list = results.list.map((res) =>
      plainToInstance(GetUserScraps, res),
    );

    return results;
  }
}
