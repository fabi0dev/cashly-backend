import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryDTO } from './dto/category.dto';
import { CategoryMapper } from './mapper/category.mapper';

@Injectable()
export class CategoryService {
  async create(userId: string, data: CreateCategoryDTO): Promise<CategoryDTO> {
    const existingCategories = await CategoryRepository.findAll(userId);

    if (existingCategories.length >= 20) {
      throw new Error('limit of 20 categories reached.');
    }

    const category = await CategoryRepository.create(userId, data);
    return CategoryMapper.toDTO(category);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCategoryDTO,
  ): Promise<CategoryDTO> {
    const updatedCategory = await CategoryRepository.update(id, userId, data);
    return CategoryMapper.toDTO(updatedCategory);
  }

  async findAll(userId: string): Promise<CategoryDTO[]> {
    const categories = await CategoryRepository.findAll(userId);
    return categories.map(CategoryMapper.toDTO);
  }

  async findOne(id: string, userId: string): Promise<CategoryDTO> {
    const category = await CategoryRepository.findOne(id, userId);
    return category ? CategoryMapper.toDTO(category) : null;
  }

  async remove(id: string, userId: string): Promise<void> {
    await CategoryRepository.remove(id, userId);
  }
}
