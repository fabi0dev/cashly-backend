import { Transform } from 'class-transformer';
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class ProhibitedPaginationDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  limit?: number = 10;
}
