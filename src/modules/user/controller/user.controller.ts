import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IUser } from 'types/user/common';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';
import { UserService } from '../service/user.service';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';

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

  @Get('/:userId')
  async getUser(@Param('userId') userId: IUser['id']) {
    return this.userService.getUser(userId);
  }
}
