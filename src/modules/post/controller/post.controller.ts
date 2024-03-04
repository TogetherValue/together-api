import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from 'src/common/request/post/create-post.dto';
import { AccessTokenGuard } from 'src/common/guard/accessToken.guard';
import { User } from 'src/core/decorator/user.decorator';
import { IUser } from 'types/user/common';
import { GetPostsQueryDto } from 'src/common/request/post/get-posts.query.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  getPosts(@Query() getPostsQueryDto: GetPostsQueryDto) {
    return this.postService.getPosts(getPostsQueryDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  createPost(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postService.createPost(createPostDto, user.id);
  }
}
