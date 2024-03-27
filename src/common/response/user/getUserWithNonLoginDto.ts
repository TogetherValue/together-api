import { Exclude, Expose } from 'class-transformer';
import { Post } from 'src/entities/post/post.entity';
import { User } from 'src/entities/user/user.entity';
import { IGetUserWithLogin } from 'types/user/common';
import { UserShowDto } from './userShowDto';
import { Subscription } from 'src/entities/subscription/subscription.entity';

export class GetUserWithLoginDto
  extends UserShowDto
  implements IGetUserWithLogin
{
  @Exclude()
  private readonly _subscriberCnt: number;
  @Exclude()
  private readonly _posts: Post[];
  @Exclude()
  private readonly _isSubscribed: boolean;

  constructor(user: User, posts: Post[], subscription: Subscription) {
    super(user);
    this._subscriberCnt = user.Subscribers.length;
    this._posts = posts;
    this._isSubscribed = !!subscription;
  }

  @Expose()
  get subscriberCnt(): number {
    return this._subscriberCnt;
  }
  @Expose()
  get posts(): Post[] {
    return this._posts;
  }
  @Expose()
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }
}
