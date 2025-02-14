import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTO } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { UserAuthDTO } from './dto/user-auth.dto';
import { HashService } from 'src/services/hash.service';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  async auth(body: AuthUserDTO): Promise<UserAuthDTO> {
    const userEntity = await UserRepository.auth({
      email: body.email,
      password: HashService.generatePassword(body.password, body.email),
    });

    if (!userEntity) {
      throw new NotFoundException('Invalid email or password');
    }

    const payload = {
      email: userEntity.email,
      userId: userEntity.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: UserMapper.entityToDTO(userEntity),
    };
  }
}
