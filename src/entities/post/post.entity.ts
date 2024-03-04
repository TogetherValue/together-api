import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IUser } from 'types/user/common';
import { User } from '../user/user.entity';
import { Scrap } from '../scrap/scrap.entity';
import { UserHistory } from '../user/user-history.entity';
import { IPost, PostCategory } from 'types/post/common';
import { Type } from 'class-transformer';
import { GetPostsRes } from 'src/common/response/post/getPostsRes';

@Entity({ name: 'posts' })
export class Post extends BaseEntity implements IPost {
  @Column({ type: 'int', unsigned: true, nullable: true })
  writerId: IUser['id'] | null;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 200 })
  thumbnail: string;

  @Column('varchar', { length: 200 })
  link: string;

  @Column({ type: 'text' })
  description: string;

  @Column('varchar', { length: 50 })
  category: PostCategory;

  @ManyToMany(() => User, (user) => user.ScrapPosts)
  ScrapedUsers: User[];

  @OneToMany(() => Scrap, (scrap) => scrap.Post)
  Scraps: Scrap[];

  @OneToMany(() => UserHistory, (userHistory) => userHistory.Post)
  UserHistory: UserHistory[];

  @ManyToOne(() => User, (user) => user.Posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'writer_id', referencedColumnName: 'id' }])
  Writer: User;

  static of(
    link: string,
    category: PostCategory,
    writerId: IUser['id'],
    thumbnail: IPost['thumbnail'],
    description: IPost['description'],
    title: IPost['title'],
  ) {
    const post = new Post();

    post.writerId = writerId;
    post.link = link;
    post.category = category;
    post.thumbnail = thumbnail;
    post.description = description;
    post.title = title;

    return post;
  }

  isOwnered(userId: IUser['id']) {
    return this.writerId === userId;
  }
}

export class PostWithWriter extends Post {
  @Type(() => User)
  Writer: User;

  toRes() {
    return new GetPostsRes(this);
  }
}
