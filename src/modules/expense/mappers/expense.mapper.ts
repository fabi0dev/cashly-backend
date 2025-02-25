import { Prisma } from '@prisma/client';
import { CreateExpenseDTO } from '../dto/create-expense.dto';
import { ExpenseDTO } from '../dto/expense.dto';
import { ExpenseEntity } from '../entities/expense.entity';
import { UpdateExpenseDTO } from '../dto/update-expense.dto';

export class ExpenseMapper {
  static toDTO(entity: ExpenseEntity): ExpenseDTO {
    const category = entity.category;

    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      date: entity.date,
      dueDate: entity.dueDate,
      isPaid: entity.isPaid,
      description: entity.description,
      isRecurring: entity.isRecurring,
      recurrenceType: entity.recurrenceType,
      recurrenceEndDate: entity.recurrenceEndDate,

      installmentsCount: entity.installmentsCount,

      category,
    };
  }

  static toCreateEntity(
    dto: CreateExpenseDTO & { userId: string },
  ): Prisma.ExpensesUncheckedCreateInput {
    return {
      date: dto.date,
      dueDate: dto.dueDate,
      isPaid: dto.isPaid,
      description: dto.description,
      isRecurring: dto.isRecurring,
      recurrenceType: dto.recurrenceType,
      recurrenceEndDate: dto.recurrenceEndDate,
      userId: dto.userId,
      amount: dto.amount,
    };
  }

  static toUpdateEntity(
    dto: UpdateExpenseDTO,
  ): Prisma.ExpensesUncheckedUpdateInput {
    return {
      date: dto.date,
      dueDate: dto.dueDate,
      isPaid: dto.isPaid,
      description: dto.description,
      isRecurring: dto.isRecurring,
      recurrenceType: dto.recurrenceType,
      recurrenceEndDate: dto.recurrenceEndDate,
      amount: dto.amount,
    };
  }
}
