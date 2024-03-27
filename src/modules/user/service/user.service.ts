import { Injectable } from '@nestjs/common';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { UserRepository } from 'src/entities/user/user.repository';
import { IUser } from 'types/user/common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getUser(userId: IUser['id']) {
    const user = await this.userRepository.findByIdOrThrow(userId);
    const subscriberCnt = await this.subscriptionRepository.getCount({
      targetUserId: userId,
    });

    console.log('subscriberCnt', subscriberCnt);
  }

  async getSubscriptions(
    getSubscriptionsQueryDto: GetSubscriptionsQueryDto,
    userId: IUser['id'],
  ) {
    return this.subscriptionRepository.getSubscriptions(
      getSubscriptionsQueryDto,
      userId,
    );
  }
}
