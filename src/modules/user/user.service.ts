import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTO } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserAuthDTO } from './dto/user-auth.dto';
import { HashService } from 'src/services/hash.service';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateProfileUserDTO } from './dto/update-profile-user.dto';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: UserEntity): string {
    const payload = {
      email: user.email,
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  async auth(body: AuthUserDTO): Promise<UserAuthDTO> {
    const userEntity = await UserRepository.auth({
      email: body.email,
      password: HashService.generatePassword(body.password, body.email),
    });

    if (!userEntity) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(userEntity);

    return {
      token,
      user: UserMapper.entityToDTO(userEntity),
    };
  }

  async createUser(body: CreateUserDTO): Promise<UserAuthDTO> {
    const user = await UserRepository.getUserByEmail(body.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const userCreated = await UserRepository.createUser({
      ...body,
      password: HashService.generatePassword(body.password, body.email),
    });

    const token = this.generateToken(userCreated);

    return {
      token,
      user: UserMapper.entityToDTO(userCreated),
    };
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const userEntity = await UserRepository.getUserById(userId);

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    await UserRepository.updatePassword(userId, {
      password: HashService.generatePassword(newPassword, userEntity.email),
    });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileUserDTO,
  ): Promise<UserDTO> {
    const userEntity = await UserRepository.getUserById(userId);

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const user = await UserRepository.updateProfile(userId, data);
    return UserMapper.entityToDTO(user);
  }
}
