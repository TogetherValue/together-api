import { Exclude, Expose } from 'class-transformer';
import { IUser, IUserShow } from 'types/user/common';

export class UserShowDto implements IUserShow {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _avatarUrl: string;
  @Exclude() private readonly _githubUrl: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _introduction: string;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _deletedAt: Date;

  constructor(user: IUser) {
    this._id = user.id;
    this._avatarUrl = user.avatarUrl;
    this._githubUrl = user.githubUrl;
    this._nickname = user.nickname;
    this._introduction = user.introduction;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get avatarUrl(): string {
    return this._avatarUrl;
  }

  @Expose()
  get githubUrl(): string {
    return this._githubUrl;
  }

  @Expose()
  get nickname(): string {
    return this._nickname;
  }

  @Expose()
  get introduction(): string {
    return this._introduction;
  }

  @Expose()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  get deletedAt(): Date {
    return this._deletedAt;
  }
}
