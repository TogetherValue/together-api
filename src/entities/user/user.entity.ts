import { Encrypt } from 'src/common/util/encrypt';
import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser } from 'types/user/common';
import { Post } from '../post/post.entity';

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

  @OneToMany(() => Post, (post) => post.Writer)
  Posts: Post[];

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
