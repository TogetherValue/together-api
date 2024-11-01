import {
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GetGithubInfoQueryDto } from 'src/common/request/auth/get-githubInfo.dto';
import { RefreshTokenGuard } from 'src/core/guard/refreshToken.guard';
import { IValidatedRefreshToken } from 'src/common/types/jwt';
import { User } from 'src/core/decorator/user.decorator';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { Logout } from 'types/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  async githubLogin(
    @Query() getGithubInfoQueryDto: GetGithubInfoQueryDto,
    @Req() req: Request,
  ) {
    const tokens = await this.authService.githubLogin(getGithubInfoQueryDto);

    req.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Patch('refresh')
  async refreshToken(
    @User() user: IValidatedRefreshToken,
    @Req() req: Request,
  ) {
    const userId = user['sub'];
    const refreshToken = user['refreshToken'];

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    req.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<Logout['Response']> {
    req.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }
}
