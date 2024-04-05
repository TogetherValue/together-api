import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetUsersQueryDto } from 'types/user/dto/getUsers';

export class GetUsersQueryDto
  extends PaginationRequest
  implements IGetUsersQueryDto {}
