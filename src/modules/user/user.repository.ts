import { prisma } from 'src/services/prisma.service';
import { UserEntity } from './entities/user.entity';
import { AuthUserDTO } from './dto/auth.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password';
import { UpdateProfileUserDTO } from './dto/update-profile-user.dto';

export class UserRepository {
  static async auth({ email, password }: AuthUserDTO): Promise<UserEntity> {
    return prisma.users.findFirst({
      where: {
        email,
        password,
        deletedAt: null,
      },
    });
  }

  static async getUserById(id: string): Promise<UserEntity> {
    return prisma.users.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async getUserByEmail(email: string): Promise<UserEntity> {
    return prisma.users.findFirst({
      where: { email, deletedAt: null },
    });
  }

  static async createUser(data: CreateUserDTO): Promise<UserEntity> {
    return prisma.users.create({
      data,
    });
  }

  static async updateUser(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return prisma.users.update({
      where: { id },
      data,
    });
  }

  static async updateProfile(
    id: string,
    data: Partial<UpdateProfileUserDTO>,
  ): Promise<UserEntity> {
    return prisma.users.update({
      where: { id },
      data,
    });
  }

  static async updatePassword(
    userId: string,
    { password }: UpdatePasswordDTO,
  ): Promise<UserEntity> {
    return prisma.users.update({
      where: { id: userId },
      data: {
        password,
      },
    });
  }
}
