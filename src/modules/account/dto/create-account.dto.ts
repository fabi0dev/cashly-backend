import { Transform } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  balance: number;
}
