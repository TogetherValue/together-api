import { IsString } from 'class-validator';

export class GetGithubInfoQueryDto {
  @IsString()
  readonly code: string;
}
