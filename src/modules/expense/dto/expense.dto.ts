import { RecurrenceType } from '@prisma/client';

export class ExpenseDTO {
  id: string;
  amount: number;
  category?: string;
  date: Date;
  dueDate?: Date;
  isPaid: boolean;
  description?: string;
  userId: string;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: Date;
}
