import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateTransactionDTO {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  date?: Date;

  @IsOptional()
  @IsString()
  accountId: string;
}
