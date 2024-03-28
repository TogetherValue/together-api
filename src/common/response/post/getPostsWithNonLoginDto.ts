import { Exclude, Expose } from 'class-transformer';
import { Post } from 'src/entities/post/post.entity';
import { IPostWithWriterNonLogin, PostCategory } from 'types/post/common';
import { IUserShow } from 'types/user/common';

export class GetPostsWithNonLoginDto implements IPostWithWriterNonLogin {
  @Exclude()
  private readonly _id: number;
  @Exclude()
  private readonly _title: string;
  @Exclude()
  private readonly _thumbnail: string;
  @Exclude()
  private readonly _link: string;
  @Exclude()
  private readonly _description: string;
  @Exclude()
  private readonly _category: PostCategory;
  @Exclude()
  private readonly _createdAt: Date;
  @Exclude()
  private readonly _updatedAt: Date;
  @Exclude()
  private readonly _deletedAt: Date;
  @Exclude()
  private readonly _Writer: IUserShow;

  constructor(post: Post) {
    this._Writer = post.Writer;
    this._title = post.title;
    this._thumbnail = post.thumbnail;
    this._link = post.link;
    this._description = post.description;
    this._category = post.category;
    this._id = post.id;
    this._createdAt = post.createdAt;
    this._updatedAt = post.updatedAt;
    this._deletedAt = post.deletedAt;
  }

  @Expose()
  get id(): number {
    return this._id;
  }
  @Expose()
  get title(): string {
    return this._title;
  }
  @Expose()
  get thumbnail(): string {
    return this._thumbnail;
  }
  @Expose()
  get link(): string {
    return this._link;
  }
  @Expose()
  get description(): string {
    return this._description;
  }
  @Expose()
  get category(): PostCategory {
    return this._category;
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
  @Expose()
  get Writer(): IUserShow {
    return this._Writer;
  }
}
