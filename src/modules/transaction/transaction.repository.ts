// src/transactions/transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';
import { prisma } from 'src/services/prisma.service';
import { TransactionEntity } from './entities/transaction.entity';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { AccountRepository } from '../account/account.repository';

@Injectable()
export class TransactionRepository {
  static async create(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<TransactionEntity> {
    const account = await AccountRepository.findOne(userId, data.accountId);

    return await prisma.transactions.create({
      data: {
        userId,
        accountBalance: account.balance,
        ...data,
      },
      include: TransactionRepository.commonIncludes,
    });
  }

  static async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<TransactionEntity>> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await prisma.$transaction([
      prisma.transactions.findMany({
        where: {
          userId,
          deletedAt: null,
          ...TransactionRepository.commonWhere,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...TransactionRepository.commonIncludes,
        },
      }),

      prisma.transactions.count({
        where: {
          userId,
          deletedAt: null,
          ...TransactionRepository.commonWhere,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      totalPages,
    };
  }

  static async findById(id: string): Promise<TransactionEntity | null> {
    return await prisma.transactions.findUnique({
      where: { id, deletedAt: null, ...TransactionRepository.commonWhere },
      include: TransactionRepository.commonIncludes,
    });
  }

  static async findByAccountId(
    accountId: string,
  ): Promise<TransactionEntity[] | null> {
    return await prisma.transactions.findMany({
      where: {
        accountId,
        deletedAt: null,
        ...TransactionRepository.commonWhere,
      },
      include: TransactionRepository.commonIncludes,
    });
  }

  static async update(
    id: string,
    data: UpdateTransactionDTO,
  ): Promise<TransactionEntity> {
    return await prisma.transactions.update({
      where: { id, deletedAt: null, ...TransactionRepository.commonWhere },
      include: TransactionRepository.commonIncludes,
      data,
    });
  }

  static async remove(userId: string, id: string): Promise<void> {
    await prisma.transactions.update({
      where: {
        userId,
        id,
        deletedAt: null,
      },
      include: TransactionRepository.commonIncludes,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  static commonWhere = {
    account: { deletedAt: null },
  };

  static commonIncludes = {
    account: {
      select: {
        id: true,
        name: true,
      },
    },

    category: {
      select: {
        id: true,
        name: true,
      },
    },
  };
}
