import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { IGetUserHistoryQueryDto } from 'types/user/dto/getUserHistory';

export class GetUserHistoryQueryDto
  extends PaginationRequest
  implements IGetUserHistoryQueryDto {}
