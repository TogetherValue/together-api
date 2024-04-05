import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_ZADD_KEY } from 'src/common/constant/redis';
import { PaginationDefault } from 'src/common/pagination/pagination.request';
import { PostCategory } from 'types/post/common';

@Injectable()
export class RedisProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async insert(key: string, value: any, postCategory: PostCategory) {
    await this.redis
      .multi()
      .lpush(key, value)
      .zincrby(REDIS_ZADD_KEY, 1, key)
      .zincrby(postCategory, 1, key)
      .exec();
  }

  async getLength(key: string) {
    return this.redis.llen(key);
  }

  async getLengthWithZSET(key: string) {
    const length = await this.redis.zscore(REDIS_ZADD_KEY, key);
    return length ? parseInt(length, 10) : 0;
  }

  async getAllByLengthDesc(
    key: string,
    page = PaginationDefault.PAGE_DEFAULT,
    take = PaginationDefault.TAKE_DEFAULT,
  ) {
    return this.redis.zrevrangebyscore(
      key,
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

  async getAllCountWithZEST(key: string) {
    return this.redis.zcard(key);
  }

  async delete(key: string) {
    return this.redis.zrem(REDIS_ZADD_KEY, key);
  }
}
