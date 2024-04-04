import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetSubscriptionPostsQueryDto } from 'types/subscription/dto/getSubscriptionPosts';

export class GetSubscriptionPostsQueryDto
  extends PaginationRequest
  implements IGetSubscriptionPostsQueryDto {}
