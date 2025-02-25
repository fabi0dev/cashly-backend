export class ExpenseInstallmentDTO {
  id: string;
  description: string;
  expenseId: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date | null;
  installmentNumber: number;
  totalInstallments: number;
  isPaid: boolean;

  category: ExpenseInstallmentDTOCategory | null;
}

type ExpenseInstallmentDTOCategory = {
  id: string;
  name: string;
};
