import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  insert(key: string, value: any) {
    return this.redis.lpush(key, value);
  }

  getLength(key: string) {
    return this.redis.llen(key);
  }

  getAll(key: string) {
    return this.redis.lrange(key, 0, -1);
  }
}
