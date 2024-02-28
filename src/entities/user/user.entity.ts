import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
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

  @Column('varchar', { length: 50, nullable: true })
  refreshToken: string;

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
}
