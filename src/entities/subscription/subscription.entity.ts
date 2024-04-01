import { BaseTimeEntity } from 'src/core/database/typeorm/base.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ISubscription } from 'types/subscription/common';
import { User } from '../user/user.entity';

@Entity({ name: 'subscriptions' })
@Index(['subscriberId', 'targetUserId'], { unique: true })
export class Subscription extends BaseTimeEntity implements ISubscription {
  @PrimaryColumn({ type: 'int', unsigned: true })
  subscriberId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  targetUserId: number;

  @ManyToOne(() => User, (user) => user.Subscriptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subscriber_id', referencedColumnName: 'id' }])
  Subscriber: User;

  @ManyToOne(() => User, (user) => user.Subscribers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'target_user_id', referencedColumnName: 'id' }])
  TargetUser: User;

  static of(subscriberId: number, targetUserId: number) {
    const subscription = new Subscription();
    subscription.subscriberId = subscriberId;
    subscription.targetUserId = targetUserId;

    return subscription;
  }
}
