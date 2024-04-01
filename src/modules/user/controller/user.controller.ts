import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IUser } from 'types/user/common';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';
import { UserService } from '../service/user.service';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { OpenGuard } from 'src/core/guard/openGuard';
import { UserShowDto } from 'src/common/response/user/userShowDto';
import { GetUserInfo } from 'types/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/subscriptions')
  async getSubscriptions(
    @Query() getSubscriptionsQueryDto: GetSubscriptionsQueryDto,
    @User() user: IUser,
  ) {
    return this.userService.getSubscriptions(getSubscriptionsQueryDto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/info')
  async getUserInfo(@User() user: IUser): Promise<GetUserInfo['Response']> {
    const userInfo = await this.userService.getUserInfo(user.id);
    return new UserShowDto(userInfo);
  }

  @UseGuards(OpenGuard)
  @Get('/:userId')
  async getUser(@Param('userId') userId: IUser['id'], @User() user: IUser) {
    let currentUserId = undefined;
    if (user) currentUserId = user.id;

    return this.userService.getUser(userId, currentUserId);
  }
}
