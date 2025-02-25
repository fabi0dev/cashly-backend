import { RecurrenceType } from '@prisma/client';

export class ExpenseEntity {
  id: string;
  amount: number;
  date: Date;
  dueDate?: Date;
  isPaid: boolean;
  description?: string;
  userId: string;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: Date;

  installmentsCount?: number;

  category?: {
    id: string;
    name: string;
  };

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
