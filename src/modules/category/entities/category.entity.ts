import { CategoryType } from '@prisma/client';

export class CategoryEntity {
  id: string;
  name: string;
  type: CategoryType;
  importanceLevel: number;
  isFavorite: boolean;
  userId: string;

  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
