import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  Configurations,
  DBConfig,
  GITHUBConfig,
  JWTConfig,
  RedisConfig,
} from '.';

@Injectable()
export class TogetherConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB');
  }

  getRedisConfig(): RedisConfig {
    return this.configService.getOrThrow('REDIS');
  }

  getGitHubConfig(): GITHUBConfig {
    return this.configService.getOrThrow('GITHUB');
  }

  getJWTConfig(): JWTConfig {
    return this.configService.getOrThrow('JWT');
  }
}
