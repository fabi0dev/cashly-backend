import { Injectable } from '@nestjs/common';
import { prisma } from 'src/services/prisma.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { AccountEntity } from './entities/account.entity';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { PaginationDTO } from 'src/dto/pagination.dto';

@Injectable()
export class AccountRepository {
  static async create(
    userId: string,
    data: CreateAccountDTO,
  ): Promise<AccountEntity> {
    return prisma.accounts.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<AccountEntity>> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await prisma.$transaction([
      prisma.accounts.findMany({
        where: { userId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),

      prisma.expenses.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      totalPages,
    };
  }

  static async findOne(userId: string, id: string): Promise<AccountEntity> {
    return prisma.accounts.findUnique({
      where: { userId, id, deletedAt: null },
    });
  }

  static async update(
    userId: string,
    id: string,
    data: UpdateAccountDTO,
  ): Promise<AccountEntity> {
    return prisma.accounts.update({
      where: { userId, id, deletedAt: null },
      data,
    });
  }

  static async delete(userId: string, id: string): Promise<void> {
    prisma.accounts.update({
      data: { deletedAt: new Date() },
      where: { id, userId, deletedAt: null },
    });
  }
}
