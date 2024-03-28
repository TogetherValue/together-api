import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ScrapService } from '../service/scrap.service';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { IPost } from 'types/post/common';
import { User } from 'src/core/decorator/user.decorator';
import { IUser } from 'types/user/common';
import { CreateScrap } from 'types/scrap/dto/createScrap';

@Controller('scraps')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/:postId')
  async createScrap(
    @Param('postId', ParseIntPipe) postId: IPost['id'],
    @User() user: IUser,
  ): Promise<CreateScrap['Response']> {
    return this.scrapService.createScrap(user.id, postId);
  }
}
