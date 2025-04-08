import { PrismaClient } from '@prisma/client';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { DateTime } from 'luxon';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

const prisma = new PrismaClient();

export class CategoryRepository {
  static async create(
    userId: string,
    data: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    return prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async update(
    id: string,
    userId: string,
    data: UpdateCategoryDTO,
  ): Promise<CategoryEntity> {
    return prisma.category.update({
      where: { id, userId, deletedAt: null },
      data,
    });
  }

  static findAll(userId: string): Promise<CategoryEntity[]> {
    return prisma.category.findMany({
      where: { userId, deletedAt: null },
      orderBy: [
        { isFavorite: 'desc' },
        { importanceLevel: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  static async findOne(id: string, userId: string): Promise<CategoryEntity> {
    return prisma.category.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  static remove(id: string, userId: string): Promise<void> {
    return prisma.category.update({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: DateTime.now().toJSDate() },
    }) as unknown as Promise<void>;
  }
}
