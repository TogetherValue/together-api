import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetUserScrapsQueryDto } from 'types/user/dto/getUserScrap';

export class GetUserScrapsQueryDto
  extends PaginationRequest
  implements IGetUserScrapsQueryDto {}
