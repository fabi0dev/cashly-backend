import { Injectable } from '@nestjs/common';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
import { ExpenseMapper } from './mappers/expense.mapper';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ExpenseDTO } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  async create(userId: string, body: CreateExpenseDTO) {
    const expenseEntity = await ExpenseRepository.create(userId, body);
    return ExpenseMapper.toDTO(expenseEntity);
  }

  async update(id: string, body: CreateExpenseDTO) {
    const expenseEntity = await ExpenseRepository.update(id, body);
    return ExpenseMapper.toDTO(expenseEntity);
  }

  async getById(id: string) {
    const expenseEntity = await ExpenseRepository.getById(id);
    if (!expenseEntity) {
      throw new Error('Expense not found');
    }
    return ExpenseMapper.toDTO(expenseEntity);
  }

  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<ExpenseDTO>> {
    const paginatedExpenses = await ExpenseRepository.getAll(
      userId,
      page,
      limit,
    );

    return {
      ...paginatedExpenses,
      data: paginatedExpenses.data.map(ExpenseMapper.toDTO),
    };
  }
}
