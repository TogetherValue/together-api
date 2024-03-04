import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}
}
