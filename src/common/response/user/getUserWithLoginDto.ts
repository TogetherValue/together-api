import { Exclude, Expose } from 'class-transformer';
import { Post } from 'src/entities/post/post.entity';
import { User } from 'src/entities/user/user.entity';
import { IGetUserWithNonLogin } from 'types/user/common';
import { UserShowDto } from './userShowDto';

export class GetUserWithNonLoginDto
  extends UserShowDto
  implements IGetUserWithNonLogin
{
  @Exclude()
  private readonly _subscriberCnt: number;
  @Exclude()
  private readonly _posts: Post[];

  constructor(user: User, posts: Post[]) {
    super(user);
    this._subscriberCnt = user.Subscribers.length;
    this._posts = posts;
  }

  @Expose()
  get subscriberCnt(): number {
    return this._subscriberCnt;
  }
  @Expose()
  get posts(): Post[] {
    return this._posts;
  }
}
