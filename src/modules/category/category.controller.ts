import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';

import { AuthGuard } from 'src/guards/auth.guard';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { JwtPayload } from 'src/types/jwt-payload';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryDTO } from './dto/category.dto';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @JwtDecode() { userId }: JwtPayload,
    @Body() createCategoryDto: CreateCategoryDTO,
  ): Promise<CategoryDTO> {
    return await this.categoryService.create(userId, createCategoryDto);
  }

  @Get()
  async findAll(@JwtDecode() { userId }: JwtPayload): Promise<CategoryDTO[]> {
    return await this.categoryService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @JwtDecode() { userId }: JwtPayload,
    @Param('id') id: string,
  ): Promise<CategoryDTO> {
    return await this.categoryService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @JwtDecode() { userId }: JwtPayload,
    @Body() updateCategoryDto: UpdateCategoryDTO,
  ): Promise<CategoryDTO> {
    return await this.categoryService.update(id, userId, updateCategoryDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @JwtDecode() { userId }: JwtPayload,
  ): Promise<void> {
    return await this.categoryService.remove(id, userId);
  }
}
