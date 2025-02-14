import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthUserDTO {
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsString({ message: 'Email must be a string.' })
  @MinLength(4, { message: 'Email must be at least 4 characters long.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
