import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  Configurations,
  DBConfig,
  GITHUBConfig,
  JWTConfig,
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

  getGitHubConfig(): GITHUBConfig {
    return this.configService.getOrThrow('GITHUB');
  }

  getJWTConfig(): JWTConfig {
    return this.configService.getOrThrow('JWT');
  }
}
