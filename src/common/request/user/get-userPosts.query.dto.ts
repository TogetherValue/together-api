import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetUserPostsQueryDto } from 'types/user/dto/getUserPosts';

export class GetUserPostsQueryDto
  extends PaginationRequest
  implements IGetUserPostsQueryDto {}
