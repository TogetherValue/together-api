import { Injectable } from '@nestjs/common';
import { GetSubscriptionPostsQueryDto } from 'src/common/request/subscription/get-subscriptionPosts.query.dto';
import { PostRepository } from 'src/entities/post/post.repository';
import { Subscription } from 'src/entities/subscription/subscription.entity';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { CreateSubscription } from 'types/subscription';
import { IUser } from 'types/user/common';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getSubscriptionPosts(
    getSubscriptionPostsQueryDto: GetSubscriptionPostsQueryDto,
    userId: IUser['id'],
  ) {
    const subscriptions = await this.subscriptionRepository.find({
      subscriberId: userId,
    });
    const subscriptionIds = subscriptions.map(
      (subscription) => subscription.targetUserId,
    );

    return this.postRepository.getSubscriptionPosts(
      getSubscriptionPostsQueryDto,
      subscriptionIds,
    );
  }

  async createSubscription(
    subscriberId: IUser['id'],
    targetUserId: IUser['id'],
  ): Promise<CreateSubscription['Response']> {
    const subscriptionEntity = Subscription.of(subscriberId, targetUserId);
    return this.subscriptionRepository.createEntity(subscriptionEntity);
  }

  async deleteSubscription(
    subscriberId: IUser['id'],
    targetUserId: IUser['id'],
  ): Promise<void> {
    await this.subscriptionRepository.findOneOrThrow({
      subscriberId,
      targetUserId,
    });
    await this.subscriptionRepository.deleteByFilters({
      subscriberId,
      targetUserId,
    });
  }
}
