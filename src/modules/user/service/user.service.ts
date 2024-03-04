import { Injectable } from '@nestjs/common';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { IUser } from 'types/user/common';

@Injectable()
export class UserService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

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
