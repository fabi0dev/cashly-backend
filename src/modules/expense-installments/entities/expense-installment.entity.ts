export class ExpenseInstallmentEntity {
  id: string;
  description: string;
  category: ExpenseInstallmentEntityCategory | null;
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

type ExpenseInstallmentEntityCategory = {
  id: string;
  name: string;
};
