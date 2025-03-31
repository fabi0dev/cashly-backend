import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDTO } from './dto/auth.dto';
import { UserAuthDTO } from './dto/user-auth.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { JwtPayload } from 'src/types/jwt-payload';
import { UpdateProfileUserDTO } from './dto/update-profile-user.dto';
import { UserDTO } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: AuthUserDTO): Promise<UserAuthDTO> {
    return await this.userService.auth(body);
  }

  @Post('auth/google')
  @UsePipes(new ValidationPipe())
  async googleAuth(@Body('token') token: string) {
    return this.userService.validateGoogleToken(token);
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() body: CreateUserDTO): Promise<UserAuthDTO> {
    return await this.userService.createUser(body);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @JwtDecode() { userId }: JwtPayload,
    @Body() body: UpdateProfileUserDTO,
  ): Promise<UserDTO> {
    return await this.userService.updateProfile(userId, body);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @JwtDecode() { userId }: JwtPayload,
    @Body() body: UpdatePasswordDTO,
  ): Promise<void> {
    return await this.userService.updatePassword(userId, body.password);
  }
}
