import { Encrypt } from 'src/common/util/encrypt';
import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { IUser } from 'types/user/common';
import { Post } from '../post/post.entity';
import { Scrap } from '../scrap/scrap.entity';
import { UserHistory } from '../user-history/user-history.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity implements IUser {
  @Column({ type: 'int', unsigned: true })
  githubId: number;

  @Column('varchar', { length: 100 })
  avatarUrl: string;

  @Column('varchar', { length: 100 })
  githubUrl: string;

  @Column('varchar', { length: 40 })
  nickname: string;

  @Column('varchar', { length: 40, default: '' })
  introduction: string;

  @Column('varchar', { length: 200, nullable: true })
  refreshToken: string | null;

  @ManyToMany(() => Post, (post) => post.ScrapedUsers)
  @JoinTable({
    name: 'scraps',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  ScrapPosts: Post[];

  @OneToMany(() => Post, (post) => post.Writer)
  Posts: Post[];

  @OneToMany(() => Scrap, (scrap) => scrap.User)
  Scraps: Scrap[];

  @OneToMany(() => UserHistory, (userHistory) => userHistory.User)
  UserHistory: UserHistory[];

  @OneToMany(() => Subscription, (subscription) => subscription.Subscriber)
  Subscriptions: Subscription[];

  @OneToMany(() => Subscription, (subscription) => subscription.TargetUser)
  Subscribers: Subscription[];

  static signUp(
    githubId: number,
    githubUrl: string,
    avatarUrl: string,
    nickname: string,
  ) {
    const user = new User();
    user.githubId = githubId;
    user.avatarUrl = avatarUrl;
    user.githubUrl = githubUrl;
    user.nickname = nickname;

    return user;
  }

  async updateRefreshToken(refreshToken: string | null) {
    this.refreshToken = await Encrypt.createHash(refreshToken);
  }
}

export class UserShow extends User {
  @Exclude()
  githubId: number;

  @Exclude()
  refreshToken: string | null;
}
