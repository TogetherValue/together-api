import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  async githubLogin(@Query() getGithubInfoQueryDto: GetGithubInfoQueryDto) {
    return this.authService.githubLogin(getGithubInfoQueryDto);
  }
}
