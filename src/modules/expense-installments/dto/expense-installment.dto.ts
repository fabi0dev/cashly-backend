export class ExpenseInstallmentDTO {
  id: string;
  expenseId: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date | null;
  installmentNumber: number;
  totalInstallments: number;
  isPaid: boolean;
}
