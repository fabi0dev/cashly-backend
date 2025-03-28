import { prisma } from 'src/services/prisma.service';
import { ExpenseInstallmentEntity } from './entities/expense-installment.entity';
import { CreateExpenseInstallmentDTO } from './dto/create-expense-installment.dto';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { FiltersExpenseInstallmentsDTO } from './dto/filters-expense-installments.dto';
import { DateTime } from 'luxon';

export class ExpenseInstallmentRepository {
  static async create(
    expenseId: string,
    data: CreateExpenseInstallmentDTO,
  ): Promise<ExpenseInstallmentEntity> {
    const expenseInstallments = await prisma.expenseInstallments.create({
      data: {
        ...data,
        expenseId,
      },
      include: ExpenseInstallmentRepository.commonInclude,
    });

    return ExpenseInstallmentRepository.mapEntityWithExpense(
      expenseInstallments,
    );
  }

  static async findByExpenseId(
    expenseId: string,
  ): Promise<ExpenseInstallmentEntity[]> {
    const expenseInstallments = await prisma.expenseInstallments.findMany({
      where: { expenseId, deletedAt: null },
      include: ExpenseInstallmentRepository.commonInclude,
      orderBy: { installmentNumber: 'asc' },
    });

    return expenseInstallments.map(
      ExpenseInstallmentRepository.mapEntityWithExpense,
    );
  }

  static async findNoPaidByExpenseId(
    expenseId: string,
  ): Promise<ExpenseInstallmentEntity[]> {
    const expenseInstallments = await prisma.expenseInstallments.findMany({
      where: { expenseId, deletedAt: null, isPaid: false },
      include: ExpenseInstallmentRepository.commonInclude,
      orderBy: { installmentNumber: 'asc' },
    });

    return expenseInstallments.map(
      ExpenseInstallmentRepository.mapEntityWithExpense,
    );
  }

  static async findOne(id: string): Promise<ExpenseInstallmentEntity | null> {
    const installment = await prisma.expenseInstallments.findUnique({
      where: { id, deletedAt: null },
      include: ExpenseInstallmentRepository.commonInclude,
    });

    if (!installment) return null;

    return ExpenseInstallmentRepository.mapEntityWithExpense(installment);
  }

  static async findAllByExpense(
    expenseId: string,
  ): Promise<ExpenseInstallmentEntity[]> {
    const expense = await prisma.expenseInstallments.findMany({
      where: { expenseId, deletedAt: null },
      include: ExpenseInstallmentRepository.commonInclude,
      orderBy: { dueDate: 'asc' },
    });

    return expense.map(ExpenseInstallmentRepository.mapEntityWithExpense);
  }

  static async findAll(
    userId: string,
    filters: FiltersExpenseInstallmentsDTO,
  ): Promise<PaginationDTO<ExpenseInstallmentEntity>> {
    const {
      page = 1,
      limit = 10,
      dueDateStart = DateTime.now().startOf('month').toJSDate(),
      dueDateEnd = DateTime.now().endOf('month').toJSDate(),
      isPaid,
      status,
      description,
      categoryId,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      expense: { userId, deletedAt: null },
      deletedAt: null,
    };

    if (dueDateStart || dueDateEnd) {
      where.dueDate = {};
      if (dueDateStart) where.dueDate.gte = dueDateStart;
      if (dueDateEnd) where.dueDate.lte = dueDateEnd;
    }

    if (isPaid !== undefined) where.isPaid = isPaid;

    if (status) where.expense = { ...where.expense, status };

    if (description)
      where.expense = {
        ...where.expense,
        description: {
          contains: description,
          mode: 'insensitive',
        },
      };

    if (categoryId) where.expense = { ...where.expense, categoryId };

    const [data, totalItems] = await prisma.$transaction([
      prisma.expenseInstallments.findMany({
        where,
        orderBy: [
          {
            isPaid: 'asc',
          },
          { dueDate: 'asc' },
          {
            installmentNumber: 'asc',
          },
        ],
        skip,
        take: limit,
        include: ExpenseInstallmentRepository.commonInclude,
      }),
      prisma.expenseInstallments.count({ where }),
    ]);

    return {
      data: data.map(ExpenseInstallmentRepository.mapEntityWithExpense),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  static async update(
    id: string,
    data: Partial<CreateExpenseInstallmentDTO>,
  ): Promise<ExpenseInstallmentEntity> {
    const expense = await prisma.expenseInstallments.update({
      where: { id },
      data,
      include: ExpenseInstallmentRepository.commonInclude,
    });

    return ExpenseInstallmentRepository.mapEntityWithExpense(expense);
  }

  static async updateByExpenseId(
    expenseId: string,
    data: Partial<CreateExpenseInstallmentDTO>,
  ) {
    return await prisma.expenseInstallments.updateMany({
      where: { expenseId },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.expenseInstallments.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static commonInclude = {
    expense: {
      select: {
        id: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  static mapEntityWithExpense(entity: any): ExpenseInstallmentEntity {
    return {
      ...entity,
      description: entity.expense.description,
      category: entity.expense.category,
    };
  }
}
