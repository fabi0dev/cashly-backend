import { TransactionType } from '@prisma/client';

export class TransactionEntity {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
  userId: string;
  accountId: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  account: Account;
}

type Account = {
  id: string;
  name: string;
};
