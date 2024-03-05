import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';
import { IUser } from 'types/user/common';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/:targetUserId')
  async createSubscription(
    @Param('targetUserId', ParseIntPipe) targetUserId: IUser['id'],
    @User() user: IUser,
  ) {
    return this.subscriptionService.createSubscription(user.id, targetUserId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:targetUserId')
  async deleteSubscription(
    @Param('targetUserId', ParseIntPipe) targetUserId: IUser['id'],
    @User() user: IUser,
  ) {
    return this.subscriptionService.deleteSubscription(user.id, targetUserId);
  }
}
