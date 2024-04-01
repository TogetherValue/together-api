import { FactoryProvider, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisProvider } from './redis.provider';
import { TogetherConfigService } from 'src/core/config/config.service';

const redisConnect: FactoryProvider = {
  provide: 'REDIS_CLIENT',
  inject: [TogetherConfigService],
  useFactory: async (configService: TogetherConfigService) => {
    const redisConfig = configService.getRedisConfig();

    const client = new Redis({
      port: 6379,
      host: redisConfig.REDIS_HOST,
    });
    return client;
  },
};

@Module({
  providers: [redisConnect, RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
