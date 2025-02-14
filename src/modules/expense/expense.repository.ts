import { prisma } from 'src/services/prisma.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';

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

  static async update(
    id: string,
    data: CreateExpenseDTO,
  ): Promise<ExpenseEntity> {
    return await prisma.expenses.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
  }

  static async getById(id: string): Promise<ExpenseEntity | null> {
    return await prisma.expenses.findUnique({
      where: {
        id: id,
      },
    });
  }
}
