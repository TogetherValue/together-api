import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { GetPostsWithLoginDto } from 'src/common/response/post/getPostsWithLoginDto';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { PostRepository } from 'src/entities/post/post.repository';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { CreatePost } from 'types/post';
import { IPost } from 'types/post/common';
import { IUser } from 'types/user/common';

@Injectable()
export class PostService {
  constructor(
    private readonly metaDataExtractor: MetaDataExtractor,
    private readonly postRepository: PostRepository,
    private readonly scrapRepository: ScrapRepository,
  ) {}

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
      const postsWithLogin = posts.list.map(
        (post) => new GetPostsWithLoginDto(post, scraps),
      );

      posts.list = postsWithLogin as any;
      return posts;
    }

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
