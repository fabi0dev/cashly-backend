import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentMethod, TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateTransactionDTO {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
