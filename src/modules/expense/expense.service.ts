import { Injectable } from '@nestjs/common';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
import { ExpenseMapper } from './mappers/expense.mapper';

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
}
