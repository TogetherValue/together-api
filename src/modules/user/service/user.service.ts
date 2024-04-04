import { Injectable } from '@nestjs/common';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { GetUserHistoryQueryDto } from 'src/common/request/user/get-userHistory.query.dto';
import { GetUserPostsQueryDto } from 'src/common/request/user/get-userPosts.query.dto';
import { GetUserScrapsQueryDto } from 'src/common/request/user/get-userScraps.query.dto';
import { GetUserWithNonLoginDto } from 'src/common/response/user/getUserWithLoginDto';
import { GetUserWithLoginDto } from 'src/common/response/user/getUserWithNonLoginDto';
import { PostRepository } from 'src/entities/post/post.repository';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { SubscriptionRepository } from 'src/entities/subscription/subscription.repository';
import { UserHistoryRepository } from 'src/entities/user-history/user-history.repository';
import { UserRepository } from 'src/entities/user/user.repository';
import { IUser } from 'types/user/common';
import { GetUser } from 'types/user/dto/getUser';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userHistoryRepository: UserHistoryRepository,
    private readonly scrapRepository: ScrapRepository,
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

  async getUserActivity(userId: IUser['id']) {
    const paginationRequest = new PaginationRequest();

    const [{ list: userHistory }, { list: userScraps }, { list: userPosts }] =
      await Promise.all([
        this.getUserHistory(paginationRequest, userId),
        this.getUserScraps(paginationRequest, userId),
        this.getUserPosts(paginationRequest, userId),
      ]);

    return {
      userHistory,
      userScraps,
      userPosts,
    };
  }

  async getUserHistory(
    getUserHistoryQueryDto: GetUserHistoryQueryDto,
    userId: IUser['id'],
  ) {
    return this.userHistoryRepository.getUserHistory(
      getUserHistoryQueryDto,
      userId,
    );
  }

  async getUserScraps(
    getUserScrapsQueryDto: GetUserScrapsQueryDto,
    userId: IUser['id'],
  ) {
    return this.scrapRepository.getUserScraps(getUserScrapsQueryDto, userId);
  }

  async getUserPosts(
    getUserPostsQueryDto: GetUserPostsQueryDto,
    userId: IUser['id'],
  ) {
    return this.postRepository.getUserPosts(getUserPostsQueryDto, userId);
  }

  async getUserInfo(userId: IUser['id']) {
    return this.userRepository.findByIdOrThrow(userId);
  }
}
