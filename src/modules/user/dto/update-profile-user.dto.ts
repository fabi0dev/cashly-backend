import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  name: string;
}
