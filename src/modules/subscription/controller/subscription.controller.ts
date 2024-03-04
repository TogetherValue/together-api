import { Controller } from '@nestjs/common';
import { SubscriptionService } from '../service/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
