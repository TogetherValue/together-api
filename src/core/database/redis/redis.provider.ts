import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PaginationDefault } from 'src/common/pagination/pagination.request';

@Injectable()
export class RedisProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async insert(key: string, value: any) {
    await this.redis
      .multi()
      .lpush(key, value)
      .zincrby('LIST_LENGTH', 1, key)
      .exec();
  }

  async getLength(key: string) {
    return this.redis.llen(key);
  }

  async getLengthWithZSET(key: string) {
    const length = await this.redis.zscore('LIST_LENGTH', key);
    return length ? parseInt(length, 10) : 0;
  }

  async getAllByLengthDesc(
    page = PaginationDefault.PAGE_DEFAULT,
    take: PaginationDefault.TAKE_DEFAULT,
  ) {
    return this.redis.zrevrangebyscore(
      'LIST_LENGTH',
      '+inf',
      '-inf',
      'LIMIT',
      (page - 1) * take,
      page * take,
    );
  }

  async getAll(key: string) {
    return this.redis.lrange(key, 0, -1);
  }
}
