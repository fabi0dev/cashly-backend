import { IsDate, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ExpenseMarkPaidDTO {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  paymentDate: Date;

  @IsString()
  accountId: string;
}
