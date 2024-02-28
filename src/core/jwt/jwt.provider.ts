import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IAccessTokenPayload,
  IJwtPayload,
  IRefreshTokenPayload,
} from 'src/common/types/jwt';
import { TogetherConfigService } from '../config/config.service';

@Injectable()
export class JwtProvider {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: TogetherConfigService,
  ) {
    const jwtConfig = this.configService.getJWTConfig();
    this.accessTokenSecret = jwtConfig.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = jwtConfig.JWT_REFRESH_SECRET;
  }

  async accessTokenSignAsync(payload: IAccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.accessTokenSecret,
      expiresIn: '1h',
    });
  }

  async refreshTokenSignAsync(payload: IRefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: '180d',
    });
  }

  async accessTokenVerifyAsync(token: string): Promise<IJwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.accessTokenSecret,
    });
  }
}
