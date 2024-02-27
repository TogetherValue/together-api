import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column('varchar', { length: 40, unique: true })
  githubId: string;

  @Column('varchar', { length: 40 })
  avatarUrl: string;

  @Column('varchar', { length: 40 })
  githubUrl: string;

  @Column('varchar', { length: 40 })
  nickname: string;

  @Column('varchar', { length: 40, nullable: true, default: '' })
  introduction: string;
}
