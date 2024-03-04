import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { MetaDataExtractor } from 'src/common/util/metaDataExtractor';
import { PostRepository } from 'src/entities/post/post.repository';
import { CreatePost } from 'types/post';
import { GetPosts } from 'types/post/dto/getPosts';
import { IUser } from 'types/user/common';

@Injectable()
export class PostService {
  constructor(
    private readonly metaDataExtractor: MetaDataExtractor,
    private readonly postRepository: PostRepository,
  ) {}

  async getPosts(
    getPostsQueryDto: GetPostsQueryDto,
  ): Promise<GetPosts['Response']> {
    return this.postRepository.getPostsWithWriter(getPostsQueryDto);
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
}
