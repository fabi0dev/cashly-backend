import { TransactionType } from '@prisma/client';

export class TransactionDTO {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
  userId: string;
  accountId: string;
  category?: string;
}
