import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/entities/user/user.repository';
import { TogetherConfigService } from '../config/config.service';
import { IAccessTokenPayload } from 'src/common/types/jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: TogetherConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJWTConfig().JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayload: IAccessTokenPayload) {
    const user = await this.userRepository.findOne({ id: jwtPayload.sub });
    if (!user) {
      throw new UnauthorizedException('접근 오류');
    }

    return user;
  }
}
