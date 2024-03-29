import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { GetPostsWithLoginDto } from 'src/common/response/post/getPostsWithLoginDto';
import { GetPostsWithNonLoginDto } from 'src/common/response/post/getPostsWithNonLoginDto';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { RedisProvider } from 'src/core/database/redis/redis.provider';
import { Post } from 'src/entities/post/post.entity';
import { PostRepository } from 'src/entities/post/post.repository';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { UserHistory } from 'src/entities/user-history/user-history.entity';
import { UserHistoryRepository } from 'src/entities/user-history/user-history.repository';
import { CreatePost } from 'types/post';
import { IPost } from 'types/post/common';
import { IUser } from 'types/user/common';

@Injectable()
export class PostService {
  constructor(
    private readonly metaDataExtractor: MetaDataExtractor,
    private readonly postRepository: PostRepository,
    private readonly scrapRepository: ScrapRepository,
    private readonly userHistoryRepository: UserHistoryRepository,
    private readonly redisProvider: RedisProvider,
  ) {}

  private async getPostView(post: Post) {
    const redisKey = `post:${post.id}`;
    const views = await this.redisProvider.getLength(redisKey);

    return views;
  }

  async getPost(
    postId: IPost['id'],
    userId: IUser['id'] | undefined,
    clientIp: string,
  ) {
    await this.postRepository.findByIdOrThrow(postId);
    const redisKey = `post:${postId}`;
    const clientKey = userId ? userId : clientIp;

    if (
      !(await this.redisProvider.getAll(redisKey)).includes(String(clientKey))
    )
      await this.redisProvider.insert(redisKey, clientKey);

    if (userId) {
      const userHistory = await this.userHistoryRepository.findOne({
        userId,
        postId,
      });

      if (userHistory) {
        userHistory.update();
        await this.userHistoryRepository.update(userHistory);
      } else {
        const userHistoryEntity = UserHistory.of(userId, postId);
        await this.userHistoryRepository.createEntity(userHistoryEntity);
      }
    }
  }

  async getPosts(
    getPostsQueryDto: GetPostsQueryDto,
    userId: number | undefined,
  ) {
    const posts = await this.postRepository.getPostsWithWriter(
      getPostsQueryDto,
    );

    if (userId) {
      const postIds = posts.list.map((post) => post.id);
      const scraps =
        await this.scrapRepository.getSubscriptionsByUserIdAndPostIds(
          userId,
          postIds,
        );

      const postWithLoginList = [];
      for (const post of posts.list) {
        const views = await this.getPostView(post);

        const getPostWithLoginDto = new GetPostsWithLoginDto(
          post,
          views,
          scraps,
        );
        postWithLoginList.push(getPostWithLoginDto);
      }

      posts.list = postWithLoginList as any;
      return posts;
    }

    const postWithNonLoginList = [];
    for (const post of posts.list) {
      const views = await this.getPostView(post);

      const getPostWithNonLoginDto = new GetPostsWithNonLoginDto(post, views);
      postWithNonLoginList.push(getPostWithNonLoginDto);
    }

    posts.list = postWithNonLoginList;
    return posts;
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: IUser['id'],
  ): Promise<CreatePost['Response']> {
    const { link } = createPostDto;

    const { thumbnail, title, description } =
      await this.metaDataExtractor.extractor(link);

    const postEntity = createPostDto.toEntity(
      userId,
      thumbnail,
      description,
      title,
    );

    return this.postRepository.createEntity(postEntity);
  }

  async deletePost(postId: IPost['id'], userId: IUser['id']) {
    const post = await this.postRepository.findByIdOrThrow(postId);
    if (!post.isOwnered(userId))
      throw new ForbiddenException('해당 글은 작성자만 삭제할 수 있습니디.');

    return this.postRepository.deleteById(postId);
  }
}
