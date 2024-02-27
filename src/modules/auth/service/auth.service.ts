import { Injectable } from '@nestjs/common';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';
import { GithubProvider } from './github.provider';

@Injectable()
export class AuthService {
  constructor(private readonly githubProvider: GithubProvider) {}

  async githubLogin(getGithubInfoQueryDto: GetGithubInfoQueryDto) {
    const { code } = getGithubInfoQueryDto;
    const githubInfo = await this.githubProvider.getGithubInfo(code);

    // todo
    // 1. 회원가입
    // 2. jwt
    // 3. 리펙토링
  }
}
