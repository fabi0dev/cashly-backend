import { TransactionType } from '@prisma/client';

export class TransactionEntity {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
