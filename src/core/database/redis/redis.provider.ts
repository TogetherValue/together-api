import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  REDIS_RECOMMEND_POST_KEY,
  REDIS_ZADD_KEY,
  generateRedisRecommendedCategoryKey,
  generateRedisViewsCategoryKey,
} from 'src/common/constant/redis';
import { PaginationDefault } from 'src/common/pagination/pagination.request';
import { PostCategory } from 'types/post/common';

@Injectable()
export class RedisProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async insert(key: string, value: any, category: PostCategory) {
    const postViewCategoryKey = generateRedisViewsCategoryKey(category);

    await this.redis
      .multi()
      .lpush(key, value)
      .zincrby(REDIS_ZADD_KEY, 1, key)
      .zincrby(postViewCategoryKey, 1, key)
      .exec();
  }

  async getLength(key: string) {
    return this.redis.llen(key);
  }

  async getLengthWithZSET(member: string, redisKey = REDIS_ZADD_KEY) {
    const length = await this.redis.zscore(redisKey, member);
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

  async updateRecommendPost(
    caculateScore: number,
    member: string,
    category: PostCategory,
  ) {
    const recommendedCategoryKey =
      generateRedisRecommendedCategoryKey(category);

    let allCategoryScore = await this.getLengthWithZSET(
      member,
      REDIS_RECOMMEND_POST_KEY,
    );
    let categoryScore = await this.getLengthWithZSET(
      member,
      recommendedCategoryKey,
    );

    allCategoryScore += caculateScore;
    categoryScore += caculateScore;

    await Promise.all([
      this.redis.zadd(REDIS_RECOMMEND_POST_KEY, allCategoryScore, member),
      this.redis.zadd(recommendedCategoryKey, categoryScore, member),
    ]);
  }

  async zrange(page: number, take: number, key = REDIS_RECOMMEND_POST_KEY) {
    return this.redis.zrevrange(key, (page - 1) * take, page * take);
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
