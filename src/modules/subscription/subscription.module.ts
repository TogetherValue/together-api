import { Module } from '@nestjs/common';
import { SubscriptionRepositoryModule } from 'src/entities/subscription/subscription.repository.module';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionService } from './service/subscription.service';

@Module({
  imports: [SubscriptionRepositoryModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
