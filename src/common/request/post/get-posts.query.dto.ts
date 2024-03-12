import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetPostsQueryDto } from 'types/post/dto/getPosts';

export class GetPostsQueryDto
  extends PaginationRequest
  implements IGetPostsQueryDto {}
