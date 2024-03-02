import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IPost, PostCategory } from 'types/post';
import { IUser } from 'types/user/common';
import { User } from '../user/user.entity';
import { Scrap } from '../scrap/scrap.entity';
import { UserHistory } from '../user/user-history.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity implements IPost {
  @Column({ type: 'int', unsigned: true, nullable: true })
  writerId: IUser['id'] | null;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 100 })
  thumnail: string;

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
}
