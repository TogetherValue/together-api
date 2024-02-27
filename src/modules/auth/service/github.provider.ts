import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { TogetherConfigService } from 'src/core/config/config.service';
import { IGithubInfo } from 'src/common/types/auth';

@Injectable()
export class GithubProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: TogetherConfigService,
  ) {}

  private async getGithubAccessToken(code: string) {
    const gitHubConfig = this.configService.getGitHubConfig();
    const getTokenUrl: string = `https://github.com/login/oauth/access_token?client_id=${gitHubConfig.GITHUB_CLIENT_ID}&client_secret=${gitHubConfig.GITHUB_SECRET_KEY}&code=${code}`;

    const request = {
      code,
      client_id: gitHubConfig.GITHUB_CLIENT_ID,
      client_secret: gitHubConfig.GITHUB_SECRET_KEY,
    };

    const response: AxiosResponse = await this.httpService.axiosRef.post(
      getTokenUrl,
      request,
      {
        headers: {
          accept: 'application/json',
        },
      },
    );

    if (response.data.error)
      throw new UnauthorizedException(
        'github accessToken을 받아 올 수 없습니다.',
      );

    const { access_token } = response.data;
    return access_token;
  }

  async getGithubInfo(code: string): Promise<IGithubInfo> {
    const accessToken = await this.getGithubAccessToken(code);
    const getUserUrl: string = 'https://api.github.com/user';

    const { data } = await this.httpService.axiosRef.get(getUserUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const {
      id: githubId,
      avatar_url: avatarUrl,
      html_url: githubUrl,
      name: nickname,
    } = data;

    const githubInfo = { githubId, avatarUrl, githubUrl, nickname };
    return githubInfo;
  }
}
