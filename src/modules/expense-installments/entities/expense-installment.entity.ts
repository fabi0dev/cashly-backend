export class ExpenseInstallmentEntity {
  id: string;
  expenseId: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date | null;
  installmentNumber: number;
  totalInstallments: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
