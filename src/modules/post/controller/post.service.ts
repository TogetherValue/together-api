import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/entities/post/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
}
