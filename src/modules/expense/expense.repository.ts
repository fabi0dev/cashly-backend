import { prisma } from 'src/services/prisma.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { PaginationDTO } from 'src/dto/pagination.dto';

export class ExpenseRepository {
  constructor() {}

  static async create(
    userId: string,
    data: CreateExpenseDTO,
  ): Promise<ExpenseEntity> {
    return await prisma.expenses.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async getById(id: string): Promise<ExpenseEntity | null> {
    return await prisma.expenses.findUnique({
      where: { id },
    });
  }

  static async update(
    id: string,
    data: Partial<CreateExpenseDTO>,
  ): Promise<ExpenseEntity> {
    return await prisma.expenses.update({
      where: { id },
      data,
    });
  }

  static async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<ExpenseEntity>> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await prisma.$transaction([
      prisma.expenses.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
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
}
