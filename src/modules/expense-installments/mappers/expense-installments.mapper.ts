import { ExpenseInstallmentDTO } from '../dto/expense-installment.dto';
import { ExpenseInstallmentEntity } from '../entities/expense-installment.entity';

export class ExpenseInstallmentsMapper {
  static toDTO(entity: ExpenseInstallmentEntity): ExpenseInstallmentDTO {
    return {
      id: entity.id,
      expenseId: entity.expenseId,
      amount: entity.amount,
      dueDate: entity.dueDate,
      paymentDate: entity.paymentDate ?? null,
      installmentNumber: entity.installmentNumber,
      totalInstallments: entity.totalInstallments,
      isPaid: entity.isPaid,

      description: entity.description,
      category: entity.category,
    };
  }
}
