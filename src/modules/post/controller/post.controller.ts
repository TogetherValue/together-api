import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';
import { IUser } from 'types/user/common';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';
import { IPost } from 'types/post/common';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  async getPosts(@Query() getPostsQueryDto: GetPostsQueryDto) {
    const results = await this.postService.getPosts(getPostsQueryDto);
    return results.list.map((res) => res.toRes());
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  createPost(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postService.createPost(createPostDto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:postId')
  deletePost(@Param('postId') postId: IPost['id'], @User() user: IUser) {
    return this.postService.deletePost(postId, user.id);
  }
}
