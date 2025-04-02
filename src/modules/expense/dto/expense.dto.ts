import { RecurrenceType } from '@prisma/client';

export class ExpenseDTO {
  id: string;
  amount: number;
  date: string;
  dueDate?: string;
  isPaid: boolean;
  description?: string;
  userId: string;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: string;

  installmentsCount?: number;
  category: {
    id: string;
    name: string;
  };

  installments?: ExpenseInstallmentDTO[];
}

export class ExpenseInstallmentDTO {
  id: string;
  amount: number;
  dueDate: string;
  paymentDate?: string | null;
  installmentNumber: number;
  totalInstallments: number;
  isPaid: boolean;
}
