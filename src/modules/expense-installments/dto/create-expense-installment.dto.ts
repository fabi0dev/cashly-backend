import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateExpenseInstallmentDTO {
  @IsString()
  expenseId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsDate()
  paymentDate?: Date | null;

  @IsNumber()
  @Min(1)
  installmentNumber: number;

  @IsNumber()
  @Min(1)
  totalInstallments: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}
