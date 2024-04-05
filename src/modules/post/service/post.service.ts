import { ForbiddenException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { REDIS_ZADD_KEY } from 'src/common/constant/redis';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';
import { PaginationResponse } from 'src/common/pagination/pagination.response';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { GetPostsWithLoginDto } from 'src/common/response/post/getPostsWithLoginDto';
import { GetPostsWithNonLoginDto } from 'src/common/response/post/getPostsWithNonLoginDto';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { RedisProvider } from 'src/core/database/redis/redis.provider';
import {
  Post,
  PostWithWriter,
  PostWithWriterWithoutToken,
} from 'src/entities/post/post.entity';
import { PostRepository } from 'src/entities/post/post.repository';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { UserHistory } from 'src/entities/user-history/user-history.entity';
import { UserHistoryRepository } from 'src/entities/user-history/user-history.repository';
import { CreatePost } from 'types/post';
import { GetPostsCategory, IPost } from 'types/post/common';
import { PostOrderBy } from 'types/post/dto/getPosts';
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
    const views = await this.redisProvider.getLengthWithZSET(redisKey);

    return views;
  }

  private async getPostsSortByViews(
    category: GetPostsCategory,
    page: number,
    take: number,
  ) {
    const redisKey =
      category === GetPostsCategory.ENTIRE ? REDIS_ZADD_KEY : category;
    const values = await this.redisProvider.getAllByLengthDesc(
      redisKey,
      page,
      take,
    );

    const postIds = values.map((value) => parseInt(value.split(':')[1]));
    const posts = await this.postRepository.findByIdsWithJoin(postIds, {
      Writer: true,
    });
    posts.sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      return postIds.indexOf(idA) - postIds.indexOf(idB);
    });

    const total = await this.redisProvider.getAllCountWithZEST(redisKey);
    return new PaginationBuilder<PostWithWriterWithoutToken>()
      .setData(plainToInstance(PostWithWriterWithoutToken, posts))
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }

  private async getPostsWithLoginUser(
    posts: PaginationResponse<PostWithWriter>,
    userId: IUser['id'],
  ) {
    const postIds = posts.list.map((post) => post.id);
    const scraps =
      await this.scrapRepository.getSubscriptionsByUserIdAndPostIds(
        userId,
        postIds,
      );

    const postWithLoginList = [];
    for (const post of posts.list) {
      const views = await this.getPostView(post);

      const getPostWithLoginDto = new GetPostsWithLoginDto(post, views, scraps);
      postWithLoginList.push(getPostWithLoginDto);
    }

    posts.list = postWithLoginList as any;
    return posts;
  }

  private async getPostsWithNonLoginUser(
    posts: PaginationResponse<PostWithWriter>,
  ) {
    const postWithNonLoginList = [];
    for (const post of posts.list) {
      const views = await this.getPostView(post);

      const getPostWithNonLoginDto = new GetPostsWithNonLoginDto(post, views);
      postWithNonLoginList.push(getPostWithNonLoginDto);
    }

    posts.list = postWithNonLoginList;
    return posts;
  }

  async getPost(
    postId: IPost['id'],
    userId: IUser['id'] | undefined,
    clientIp: string,
  ) {
    const post = await this.postRepository.findByIdOrThrow(postId);
    const redisKey = `post:${postId}`;
    const clientKey = userId ? userId : clientIp;

    if (
      !(await this.redisProvider.getAll(redisKey)).includes(String(clientKey))
    )
      await this.redisProvider.insert(redisKey, clientKey, post.category);

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
    const { category, orederBy, page, take } = getPostsQueryDto;
    let posts: PaginationResponse<PostWithWriter>;

    if (orederBy === PostOrderBy.VIEWS) {
      posts = await this.getPostsSortByViews(category, page, take);
    }
    if (orederBy === PostOrderBy.LATEST) {
      posts = await this.postRepository.getPostsWithWriter(
        getPostsQueryDto,
        category,
      );
    }

    //  posts = await this.postRepository.getPostsWithWriter(
    //   getPostsQueryDto,
    // );

    if (userId) {
      const postsWithLoginUser = await this.getPostsWithLoginUser(
        posts,
        userId,
      );
      return postsWithLoginUser;
    }

    const postsWithNonLoginUser = await this.getPostsWithNonLoginUser(posts);
    return postsWithNonLoginUser;
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

    const redisKey = `post:${postId}`;
    await this.redisProvider.delete(redisKey);
    return this.postRepository.deleteById(postId);
  }
}
