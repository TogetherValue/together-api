import { ForbiddenException, Injectable } from '@nestjs/common';
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
import axios from 'axios';
import * as cheerio from 'cheerio';

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
    if (isUserExist) {
      const tokens = await this.generateTokens(isUserExist.id);

      await isUserExist.updateRefreshToken(tokens.refreshToken);
      await this.userRepository.update(isUserExist);

      return tokens;
    }

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

  async test() {
    const url = 'https://helloinyong.tistory.com/350';

    const result = await axios.get(url);

    const $ = cheerio.load(result.data);
    const title = $('title').text();
    const thumbnail =
      $('meta[name="image"]').attr('content') ||
      $('meta[property="image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content');
    const description =
      $('meta[name="og:description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[property="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[property="twitter:description"]').attr('content');

    const createdAt = $('meta[property="Date"]').attr('content');

    console.log('Title:', title);
    console.log('Thumbnail:', thumbnail);
    console.log('description', description.length);

    console.log('CreatedAt:', createdAt);
  }
}
