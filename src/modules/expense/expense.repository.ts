import { prisma } from 'src/services/prisma.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ExpenseMapper } from './mappers/expense.mapper';
import { UpdateExpenseDTO } from './dto/update-expense.dto';
import { CreateExpenseInstallmentDTO } from '../expense-installments/dto/create-expense-installment.dto';
import { TransactionRepository } from '../transaction/transaction.repository';
import { AccountRepository } from '../account/account.repository';
import { DateTime } from 'luxon';

export class ExpenseRepository {
  constructor() {}

  static async create(
    userId: string,
    data: CreateExpenseDTO,
  ): Promise<ExpenseEntity> {
    const expenseToInsert = ExpenseMapper.toCreateEntity({
      ...data,
      userId,
    });

    const expense = await prisma.expenses.create({
      data: expenseToInsert,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const installments = data.installments || 1;

    if (installments > 0) {
      const installmentData: CreateExpenseInstallmentDTO[] = [];

      const accountDefault = await AccountRepository.findDefault(userId);

      for (let i = 0; i < installments; i++) {
        const dueDate = new Date(expense.dueDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        installmentData.push({
          expenseId: expense.id,
          amount: data.amount,
          dueDate,
          installmentNumber: i + 1,
          totalInstallments: installments,
          isPaid: data.isPaid,
          paymentDate: data.isPaid ? DateTime.now().toJSDate() : null,
        });

        if (data.isPaid) {
          await TransactionRepository.create(userId, {
            date: expense.dueDate,
            amount: data.amount,
            description: expense.description,
            accountId: accountDefault.id,
            type: 'EXIT',
            categoryId: expense.categoryId,
          });
        }
      }

      await prisma.expenseInstallments.createMany({
        data: installmentData,
      });
    }

    return expense;
  }

  static async findOne(id: string): Promise<ExpenseEntity | null> {
    return await prisma.expenses.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: Partial<UpdateExpenseDTO>,
  ): Promise<ExpenseEntity> {
    const expense = ExpenseMapper.toUpdateEntity({
      ...data,
    });

    return await prisma.expenses.update({
      where: { id },
      data: expense,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<ExpenseEntity>> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await prisma.$transaction([
      prisma.expenses.findMany({
        where: { userId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              installments: true,
            },
          },
        },
      }),

      prisma.expenses.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map((expense) => ({
        ...expense,
        installmentsCount: expense._count.installments,
      })),
      totalItems,
      totalPages,
    };
  }

  static async delete(userId: string, id: string): Promise<void> {
    await prisma.expenses.update({
      where: { id, userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
