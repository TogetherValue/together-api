import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';
import { RefreshTokenGuard } from 'src/common/guard/refreshToken.guard';
import { IValidatedRefreshToken } from 'src/common/types/jwt';
import { User } from 'src/core/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  async githubLogin(@Query() getGithubInfoQueryDto: GetGithubInfoQueryDto) {
    return this.authService.githubLogin(getGithubInfoQueryDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Patch('refresh')
  async refreshToken(@User() user: IValidatedRefreshToken) {
    const userId = user['sub'];
    const refreshToken = user['refreshToken'];

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
