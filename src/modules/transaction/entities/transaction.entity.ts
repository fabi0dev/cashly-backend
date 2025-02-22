import { TransactionType } from '@prisma/client';

export class TransactionEntity {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
  userId: string;
  accountId: string;
  accountBalance: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  account: Account;
  category: Category;
}

type Account = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};
