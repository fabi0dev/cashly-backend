// src/transactions/transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';
import { prisma } from 'src/services/prisma.service';
import { TransactionEntity } from './entities/transaction.entity';
import { PaginationDTO } from 'src/dto/pagination.dto';

@Injectable()
export class TransactionRepository {
  static async create(
    userId: string,
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<TransactionEntity> {
    return await prisma.transactions.create({
      data: {
        userId,
        ...createTransactionDTO,
      },
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
        where: { userId },
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

  static async findById(id: string): Promise<TransactionEntity | null> {
    return await prisma.transactions.findUnique({
      where: { id },
    });
  }

  static async update(
    id: string,
    updateTransactionDTO: UpdateTransactionDTO,
  ): Promise<TransactionEntity> {
    return await prisma.transactions.update({
      where: { id },
      data: updateTransactionDTO,
    });
  }

  static async remove(userId: string, id: string): Promise<TransactionEntity> {
    return await prisma.transactions.update({
      where: {
        userId,
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
