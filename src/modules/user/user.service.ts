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
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UserService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: UserEntity): string {
    return this.jwtService.sign({
      email: user.email,
      userId: user.id,
    });
  }
  async auth(body: AuthUserDTO): Promise<UserAuthDTO> {
    const userEntity = await UserRepository.auth({
      email: body.email,
      password: HashService.generatePassword(body.password, body.email),
    });

    if (!userEntity) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      token: this.generateToken(userEntity),
      user: UserMapper.entityToDTO(userEntity),
    };
  }

  async validateGoogleToken(token: string): Promise<UserAuthDTO> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid Google Token');

      const existingUser = await UserRepository.getUserByEmail(payload.email);

      if (existingUser) {
        const updatedUser = await UserRepository.updateUser(existingUser.id, {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });

        return {
          token: this.generateToken(updatedUser),
          user: UserMapper.entityToDTO(updatedUser),
        };
      }

      return this.createUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture || null,
        password: payload.exp.toString(),
      });
    } catch (err) {
      console.error(err);
      throw new Error('Google authentication failed');
    }
  }

  async createUser(body: CreateUserDTO): Promise<UserAuthDTO> {
    const exists = await UserRepository.getUserByEmail(body.email);
    if (exists) throw new ConflictException('User already exists');

    const userCreated = await UserRepository.createUser({
      ...body,
      password: body.password
        ? HashService.generatePassword(body.password, body.email)
        : HashService.generateRandomHash(),
    });

    return {
      token: this.generateToken(userCreated),
      user: UserMapper.entityToDTO(userCreated),
    };
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await UserRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    await UserRepository.updatePassword(userId, {
      password: HashService.generatePassword(newPassword, user.email),
    });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileUserDTO,
  ): Promise<UserDTO> {
    const user = await UserRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const updated = await UserRepository.updateProfile(userId, data);
    return UserMapper.entityToDTO(updated);
  }
}
