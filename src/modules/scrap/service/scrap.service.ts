import { Injectable } from '@nestjs/common';
import { generateRedisPostIdKey } from 'src/common/constant/redis';
import { POST_SCRAP_SCORE } from 'src/common/constant/score';
import { RedisProvider } from 'src/core/database/redis/redis.provider';
import { Transactional } from 'src/core/decorator/transactional.decorator';
import { PostRepository } from 'src/entities/post/post.repository';
import { Scrap } from 'src/entities/scrap/scrap.entity';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { IPost } from 'types/post/common';
import { IUser } from 'types/user/common';

@Injectable()
export class ScrapService {
  constructor(
    private readonly redisProvide: RedisProvider,
    private readonly scrapRepository: ScrapRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createScrap(userId: IUser['id'], postId: IPost['id']) {
    const scrapEntity = Scrap.of(userId, postId);
    const post = await this.postRepository.findByIdOrThrow(postId);
    const postIdKey = generateRedisPostIdKey(postId);

    await this.redisProvide.updateRecommendPost(
      POST_SCRAP_SCORE,
      postIdKey,
      post.category,
    );
    return this.scrapRepository.createEntity(scrapEntity);
  }

  @Transactional()
  async deleteScrap(userId: IUser['id'], postId: IPost['id']): Promise<void> {
    const post = await this.postRepository.findByIdOrThrow(postId);
    await this.scrapRepository.findOneOrThrow({
      userId,
      postId,
    });
    await this.scrapRepository.deleteByFilters({
      userId,
      postId,
    });

    const postIdKey = generateRedisPostIdKey(postId);
    await this.redisProvide.updateRecommendPost(
      POST_SCRAP_SCORE * -1,
      postIdKey,
      post.category,
    );
  }
}
