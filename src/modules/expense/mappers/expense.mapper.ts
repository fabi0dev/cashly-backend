import { ExpenseDTO } from '../dto/expense.dto';
import { ExpenseEntity } from '../entities/expense.entity';

export class ExpenseMapper {
  static toDTO(entity: ExpenseEntity): ExpenseDTO {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      category: entity.category,
      date: entity.date,
      dueDate: entity.dueDate,
      isPaid: entity.isPaid,
      description: entity.description,
      isRecurring: entity.isRecurring,
      recurrenceType: entity.recurrenceType,
      recurrenceEndDate: entity.recurrenceEndDate,
    };
  }
}
