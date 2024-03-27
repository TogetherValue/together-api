import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IPaginationQuery } from 'types/common';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
}

export class PaginationRequest implements IPaginationQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page = PaginationDefault.PAGE_DEFAULT;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take = PaginationDefault.TAKE_DEFAULT;

  getSkip() {
    return (this.page - 1) * this.take;
  }

  getTake() {
    return this.take;
  }
}
