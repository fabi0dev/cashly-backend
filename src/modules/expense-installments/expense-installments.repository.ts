import { prisma } from 'src/services/prisma.service';
import { ExpenseInstallmentEntity } from './entities/expense-installment.entity';
import { CreateExpenseInstallmentDTO } from './dto/create-expense-installment.dto';

export class ExpenseInstallmentRepository {
  static async create(
    expenseId: string,
    data: CreateExpenseInstallmentDTO,
  ): Promise<ExpenseInstallmentEntity> {
    return await prisma.expenseInstallments.create({
      data: {
        ...data,
        expenseId,
      },
    });
  }

  static async findByExpenseId(
    expenseId: string,
  ): Promise<ExpenseInstallmentEntity[]> {
    return await prisma.expenseInstallments.findMany({
      where: { expenseId, deletedAt: null },
      orderBy: { installmentNumber: 'asc' },
    });
  }

  static async findOne(id: string): Promise<ExpenseInstallmentEntity | null> {
    return await prisma.expenseInstallments.findUnique({
      where: { id, deletedAt: null },
    });
  }

  static async update(
    id: string,
    data: Partial<CreateExpenseInstallmentDTO>,
  ): Promise<ExpenseInstallmentEntity> {
    return await prisma.expenseInstallments.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.expenseInstallments.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
