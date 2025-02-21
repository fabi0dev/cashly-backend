import { TransactionType } from '@prisma/client';

export class TransactionDTO {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
  userId: string;
  accountId: string;
  category?: string;

  account: Account;
}

type Account = {
  id: string;
  name: string;
};
