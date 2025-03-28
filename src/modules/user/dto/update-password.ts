import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}
