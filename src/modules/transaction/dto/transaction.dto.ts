import { TransactionType } from '@prisma/client';

export class TransactionDTO {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
  userId: string;
  accountId: string;
  accountBalance: number;
  categoryId: string;
  expenseId?: string;

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
