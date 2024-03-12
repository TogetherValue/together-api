import { Exclude, Expose } from 'class-transformer';
import { IPostWithWriter, PostCategory } from 'types/post/common';
import { UserShowDto } from '../user/userShowDto';
import { IUser } from 'types/user/common';
import { PostWithWriter } from 'src/entities/post/post.entity';

export class GetPostsRes implements IPostWithWriter {
  @Exclude() private readonly _postId: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _thumbnail: string;
  @Exclude() private readonly _link: string;
  @Exclude() private readonly _description: string;
  @Exclude() private readonly _category: PostCategory;
  @Exclude() private readonly _Writer: IUser;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _deletedAt: Date;

  constructor(post: PostWithWriter) {
    this._postId = post.id;
    this._title = post.title;
    this._thumbnail = post.thumbnail;
    this._link = post.link;
    this._description = post.description;
    this._category = post.category;
    this._createdAt = post.createdAt;
    this._updatedAt = post.updatedAt;
    this._deletedAt = post.deletedAt;
    this._Writer = post.Writer;
  }

  @Expose()
  get postId(): number {
    return this._postId;
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
  get Writer(): UserShowDto {
    return new UserShowDto(this._Writer);
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
