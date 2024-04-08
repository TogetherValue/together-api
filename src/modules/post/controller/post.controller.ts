import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';
import { IUser } from 'types/user/common';
import { IPost } from 'types/post/common';
import { OpenGuard } from 'src/core/guard/openGuard';
import { Request } from 'express';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(OpenGuard)
  @Get('/:postId')
  async getPost(
    @Req() req: Request,
    @Param('postId') postId: IPost['id'],
    @User() user: IUser,
  ) {
    let currentUserId = undefined;
    if (user) currentUserId = user.id;

    return this.postService.getPost(postId, currentUserId, req.clientIp);
  }

  @UseGuards(OpenGuard)
  @Get('')
  async getPosts(
    @Query() getPostsQueryDto: GetPostsQueryDto,
    @User() user: IUser,
  ) {
    let currentUserId = undefined;
    if (user) currentUserId = user.id;

    return this.postService.getPosts(getPostsQueryDto, currentUserId);
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
