import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsBoolean()
  isDefault: boolean;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  balance: number;
}
