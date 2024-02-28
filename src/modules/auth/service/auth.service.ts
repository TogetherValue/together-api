import { ConflictException, Injectable } from '@nestjs/common';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';
import { GithubProvider } from './github.provider';
import { UserRepository } from 'src/entities/user/user.repository';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubProvider: GithubProvider,
    private readonly userRepository: UserRepository,
  ) {}

  async githubLogin(getGithubInfoQueryDto: GetGithubInfoQueryDto) {
    const { code } = getGithubInfoQueryDto;
    const { githubId, githubUrl, avatarUrl, nickname } =
      await this.githubProvider.getGithubInfo(code);

    const user = await this.userRepository.findOne({ githubId });
    if (user) throw new ConflictException('User already exists');

    const userEntity = User.signUp(githubId, githubUrl, avatarUrl, nickname);
    await this.userRepository.createEntity(userEntity);

    // todo
    // 1. 회원가입
    // 2. jwt
  }
}
