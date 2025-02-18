export interface AccountEntity {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  balance: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
