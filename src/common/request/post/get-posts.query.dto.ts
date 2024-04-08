import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { GetPostsCategory } from 'types/post/common';
import { IGetPostsQueryDto, PostOrderBy } from 'types/post/dto/getPosts';

export class GetPostsQueryDto
  extends PaginationRequest
  implements IGetPostsQueryDto
{
  @IsOptional()
  @IsEnum(PostOrderBy)
  orederBy: PostOrderBy = PostOrderBy.RECOMMENDED;

  @IsOptional()
  @IsEnum(GetPostsCategory)
  category: GetPostsCategory = GetPostsCategory.ENTIRE;
}
