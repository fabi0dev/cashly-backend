import { Injectable } from '@nestjs/common';
import { prisma } from 'src/services/prisma.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { AccountEntity } from './entities/account.entity';
import { UpdateAccountDTO } from './dto/update-account.dto';

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

  static async findAll(userId: string): Promise<AccountEntity[]> {
    return prisma.accounts.findMany({
      where: { userId, deletedAt: null },
    });
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
