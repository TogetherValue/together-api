import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';
import { GithubProvider } from './github.provider';
import { UserRepository } from 'src/entities/user/user.repository';
import { User } from 'src/entities/user/user.entity';
import { JwtProvider } from 'src/core/jwt/jwt.provider';
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from 'src/common/types/jwt';
import { Encrypt } from 'src/common/util/encrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubProvider: GithubProvider,
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
  ) {}

  private async generateTokens(sub: User['id']) {
    const accessTokenPayload: IAccessTokenPayload = {
      sub,
    };
    const refreshTokenPayload: IRefreshTokenPayload = {
      sub,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtProvider.accessTokenSignAsync(accessTokenPayload),
      this.jwtProvider.refreshTokenSignAsync(refreshTokenPayload),
    ]);

    return { accessToken, refreshToken };
  }

  async githubLogin(getGithubInfoQueryDto: GetGithubInfoQueryDto) {
    const { code } = getGithubInfoQueryDto;
    const { githubId, githubUrl, avatarUrl, nickname } =
      await this.githubProvider.getGithubInfo(code);

    const isUserExist = await this.userRepository.findOne({ githubId });
    if (isUserExist) throw new ConflictException('User already exists');

    const userEntity = User.signUp(githubId, githubUrl, avatarUrl, nickname);
    const user = await this.userRepository.createEntity(userEntity);

    const tokens = await this.generateTokens(user.id);

    await user.updateRefreshToken(tokens.refreshToken);
    await this.userRepository.update(user);

    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: User['refreshToken']) {
    const user = await this.userRepository.findByIdOrThrow(userId);
    if (!user.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await Encrypt.isSameAsHash(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user.id);
    await user.updateRefreshToken(tokens.refreshToken);
    await this.userRepository.update(user);

    return tokens;
  }
}
