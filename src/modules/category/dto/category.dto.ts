import { CategoryType } from '@prisma/client';

export class CategoryDTO {
  id: string;
  name: string;
  type: CategoryType;
  importanceLevel: number;
  isFavorite: boolean;
  userId: string;
}
