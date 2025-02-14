import { prisma } from 'src/services/prisma.service';
import { UserEntity } from './entities/user.entity';
import { AuthUserDTO } from './dto/auth.dto';

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
}
