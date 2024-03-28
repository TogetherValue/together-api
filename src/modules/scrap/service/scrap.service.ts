import { Injectable } from '@nestjs/common';
import { Scrap } from 'src/entities/scrap/scrap.entity';
import { ScrapRepository } from 'src/entities/scrap/scrap.repository';
import { IPost } from 'types/post/common';
import { IUser } from 'types/user/common';

@Injectable()
export class ScrapService {
  constructor(private readonly scrapRepository: ScrapRepository) {}

  async createScrap(userId: IUser['id'], postId: IPost['id']) {
    const scrapEntity = Scrap.of(userId, postId);
    return this.scrapRepository.createEntity(scrapEntity);
  }
}
