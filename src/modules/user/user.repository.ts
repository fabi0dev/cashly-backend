import { prisma } from 'src/services/prisma.service';
import { UserEntity } from './entities/user.entity';
import { AuthUserDTO } from './dto/auth.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password';
import { UpdateProfileUserDTO } from './dto/update-profile-user.dto';

export class UserRepository {
  constructor() {}

  static async auth({ email, password }: AuthUserDTO): Promise<UserEntity> {
    const entity = await prisma.users.findFirst({
      where: {
        AND: [
          {
            email,
          },
          {
            password,
          },
        ],
        deletedAt: null,
      },
    });

    return entity;
  }

  static async getUserById(id: string): Promise<UserEntity> {
    const user = await prisma.users.findUnique({
      where: { id, deletedAt: null },
    });

    return user;
  }

  static async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await prisma.users.findUnique({
      where: { email, deletedAt: null },
    });

    return user;
  }

  static async createUser({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<UserEntity> {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  static async updateUser(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const updatedUser = await prisma.users.update({
      where: { id },
      data,
    });

    return updatedUser;
  }

  static async updateProfile(
    id: string,
    data: Partial<UpdateProfileUserDTO>,
  ): Promise<UserEntity> {
    const updatedUser = await prisma.users.update({
      where: { id },
      data,
    });

    return updatedUser;
  }

  static async updatePassword(
    userId: string,
    { password }: UpdatePasswordDTO,
  ): Promise<UserEntity> {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        password,
      },
    });

    return updatedUser;
  }
}
