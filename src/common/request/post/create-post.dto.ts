import { IsEnum, IsString } from 'class-validator';
import { Post } from 'src/entities/post/post.entity';
import { IPost, PostCategory } from 'types/post/common';
import { ICreatePostDto } from 'types/post/dto/createPost';

import { IUser } from 'types/user/common';

export class CreatePostDto implements ICreatePostDto {
  @IsString()
  link: string;

  @IsEnum(PostCategory)
  category: PostCategory;

  toEntity(
    writerId: IUser['id'],
    thumbnail: IPost['thumbnail'],
    description: IPost['description'],
    title: IPost['title'],
  ) {
    return Post.of(
      this.link,
      this.category,
      writerId,
      thumbnail,
      description,
      title,
    );
  }
}
