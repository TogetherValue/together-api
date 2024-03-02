import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IPost, PostCategory } from 'types/post';
import { IUser } from 'types/user/common';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => User, (user) => user.Posts)
  @JoinColumn([{ name: 'writer_id', referencedColumnName: 'id' }])
  Writer: User;
}
