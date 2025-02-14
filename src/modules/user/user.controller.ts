import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDTO } from './dto/auth.dto';
import { UserAuthDTO } from './dto/user-auth.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: AuthUserDTO): Promise<UserAuthDTO> {
    return await this.userService.auth(body);
  }
}
