import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
    const results = await this.userService.getSubscriptions(
      getSubscriptionsQueryDto,
      user.id,
    );

    return results.list.map((res) => res.toRes());
  }
}
