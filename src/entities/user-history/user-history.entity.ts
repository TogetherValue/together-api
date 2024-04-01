import { BaseTimeEntity } from 'src/core/database/typeorm/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { IUserHistory } from 'types/userPostHistory/common';

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

  static of(userId: number, postId: number) {
    const userHistory = new UserHistory();
    userHistory.userId = userId;
    userHistory.postId = postId;
    userHistory.viewedAt = new Date();

    return userHistory;
  }

  update() {
    this.viewedAt = new Date();
  }
}
