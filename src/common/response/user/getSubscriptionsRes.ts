import { Exclude, Expose } from 'class-transformer';
import { GetSubscriptionsWithUser } from 'src/entities/subscription/subscription.entity';
import { User } from 'src/entities/user/user.entity';
import { IGetSubScriptions } from 'types/subscription/common';

export class getSubscriptionsRes implements IGetSubScriptions {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _TargetUser: User;

  constructor(subscriptions: GetSubscriptionsWithUser) {
    this._userId = subscriptions.subscriberId;
    this._TargetUser = subscriptions.TargetUser;
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  get TargetUser(): User {
    return this._TargetUser;
  }
}
