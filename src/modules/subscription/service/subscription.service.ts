import { Injectable } from '@nestjs/common';
import { Subscription } from 'src/entities/subscription/subscription.entity';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { IUser } from 'types/user/common';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async createSubscription(
    subscriberId: IUser['id'],
    targetUserId: IUser['id'],
  ) {
    const subscriptionEntity = Subscription.of(subscriberId, targetUserId);
    return this.subscriptionRepository.createEntity(subscriptionEntity);
  }
}
