import { Injectable } from '@nestjs/common';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { GetSubscriptionsQueryDto } from 'src/common/request/user/get-subscriptions.query.dto';
import { GetUserWithNonLoginDto } from 'src/common/response/user/getUserWithLoginDto';
import { GetUserWithLoginDto } from 'src/common/response/user/getUserWithNonLoginDto';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { UserRepository } from 'src/entities/user/user.repository';
import { IUser } from 'types/user/common';
import { GetUser } from 'types/user/dto/getUser';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getUser(
    targetUserId: IUser['id'],
    userId: IUser['id'],
  ): Promise<GetUser['Response']> {
    const userWithSubscriber =
      await this.userRepository.findByIdWithJoinOrThrow(targetUserId, {
        Subscribers: true,
      });
    const posts = await this.postRepository.paginate(new PaginationRequest(), {
      where: { writerId: targetUserId },
    });

    if (userId) {
      const subscription = await this.subscriptionRepository.findOne({
        subscriberId: userId,
        targetUserId: targetUserId,
      });

      return new GetUserWithLoginDto(
        userWithSubscriber,
        posts.list,
        subscription,
      );
    }

    return new GetUserWithNonLoginDto(userWithSubscriber, posts.list);
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
