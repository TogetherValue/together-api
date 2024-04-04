import { BaseTimeEntity } from 'src/core/database/typeorm/base.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IScrap } from 'types/scrap/common';
import { User } from '../user/user.entity';
import { Post, PostWithWriterWithoutToken } from '../post/post.entity';
import { IUser } from 'types/user/common';
import { IPost } from 'types/post/common';
import { Type } from 'class-transformer';

@Entity({ name: 'scraps' })
@Index(['userId', 'postId'], { unique: true })
export class Scrap extends BaseTimeEntity implements IScrap {
  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  postId: number;

  @ManyToOne(() => User, (user) => user.Scraps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  @ManyToOne(() => Post, (post) => post.Scraps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  Post: Post;

  static of(userId: IUser['id'], postId: IPost['id']) {
    const scrap = new Scrap();
    scrap.userId = userId;
    scrap.postId = postId;

    return scrap;
  }
}

export class GetUserScraps extends Scrap {
  @Type(() => PostWithWriterWithoutToken)
  Post: PostWithWriterWithoutToken;
}
