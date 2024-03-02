import { BaseTimeEntity } from 'src/core/database/typeorm/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { IUserHistory } from 'types/userPostHistory';
import { User } from './user.entity';
import { Post } from '../post/post.entity';

@Entity({ name: 'user_history' })
@Index(['userId', 'postId'], { unique: true })
export class UserHistory extends BaseTimeEntity implements IUserHistory {
  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  postId: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  viewedAt: Date;

  @ManyToOne(() => User, (user) => user.UserHistory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  @ManyToOne(() => Post, (post) => post.UserHistory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  Post: Post;
}
