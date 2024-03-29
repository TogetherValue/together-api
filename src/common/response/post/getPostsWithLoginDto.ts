import { Post } from 'src/entities/post/post.entity';
import { Scrap } from 'src/entities/scrap/scrap.entity';
import { IPostWithWriterLogin, PostCategory } from 'types/post/common';
import { GetPostsWithNonLoginDto } from './getPostsWithNonLoginDto';
import { Exclude, Expose } from 'class-transformer';

export class GetPostsWithLoginDto
  extends GetPostsWithNonLoginDto
  implements IPostWithWriterLogin
{
  @Exclude()
  private readonly _isScraped: boolean;

  constructor(post: Post, views: number, scraps: Scrap[]) {
    super(post, views);
    this._isScraped = scraps.some((scrap) => scrap.postId === post.id);
  }

  @Expose()
  get isScraped(): boolean {
    return this._isScraped;
  }
}
