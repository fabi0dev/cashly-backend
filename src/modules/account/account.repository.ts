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
    return await prisma.accounts.create({
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

  static async findAllWithoutPagination(
    userId: string,
  ): Promise<AccountEntity[]> {
    return await prisma.accounts.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findOne(userId: string, id: string): Promise<AccountEntity> {
    return await prisma.accounts.findUnique({
      where: { userId, id, deletedAt: null },
    });
  }

  static async update(
    userId: string,
    id: string,
    data: UpdateAccountDTO,
  ): Promise<AccountEntity> {
    return await prisma.accounts.update({
      where: { userId, id, deletedAt: null },
      data,
    });
  }

  static async delete(userId: string, id: string): Promise<void> {
    await prisma.accounts.update({
      data: { deletedAt: new Date() },
      where: { id, userId, deletedAt: null },
    });
  }

  static async recalculateBalances(userId: string): Promise<void> {
    const accountEntries = await prisma.transactions.groupBy({
      by: ['accountId'],
      where: { userId, type: 'ENTRY', deletedAt: null },
      _sum: { amount: true },
    });

    const accountExits = await prisma.transactions.groupBy({
      by: ['accountId'],
      where: { userId, type: 'EXIT', deletedAt: null },
      _sum: { amount: true },
    });

    const balancesMap = new Map<string, number>();

    accountEntries.forEach(({ accountId, _sum }) => {
      balancesMap.set(accountId, _sum.amount || 0);
    });

    accountExits.forEach(({ accountId, _sum }) => {
      const currentBalance = balancesMap.get(accountId) || 0;
      balancesMap.set(accountId, currentBalance - (_sum.amount || 0));
    });

    if (balancesMap.size === 0) {
      await prisma.accounts.updateMany({
        where: { userId },
        data: { balance: 0 },
      });
      return;
    }

    const updatePromises = Array.from(balancesMap.entries()).map(
      ([accountId, balance]) =>
        prisma.accounts.update({
          where: { id: accountId },
          data: { balance },
        }),
    );

    await prisma.$transaction(updatePromises);
  }
}
