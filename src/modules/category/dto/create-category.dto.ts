import { CategoryType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, Max, IsEnum } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Max(3, {
    message: 'must be between 1 and 3',
  })
  importanceLevel: number;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value))
  isFavorite: boolean;
}
