import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ProhibitedPaginationDTO } from 'src/dto/pagination-prohibited.dto';

export class FiltersExpenseInstallmentsDTO extends PartialType(
  ProhibitedPaginationDTO,
) {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDateStart?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDateEnd?: Date;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPaid?: boolean;

  @IsOptional()
  status?: string;
}
