import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
import { ExpenseMapper } from './mappers/expense.mapper';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ExpenseDTO } from './dto/expense.dto';
import { ExpenseInstallmentRepository } from '../expense-installments/expense-installments.repository';

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
    const expenseEntity = await ExpenseRepository.findOne(id);
    if (!expenseEntity) {
      throw new NotFoundException('Expense not found');
    }

    const expenseInstallments =
      await ExpenseInstallmentRepository.findAllByExpense(expenseEntity.id);

    return {
      ...ExpenseMapper.toDTO(expenseEntity),
      installments: expenseInstallments.map(
        ExpenseMapper.expenseInstallmentsToDTO,
      ),
    };
  }

  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<ExpenseDTO>> {
    const paginatedExpenses = await ExpenseRepository.findAll(
      userId,
      page,
      limit,
    );

    return {
      ...paginatedExpenses,
      data: paginatedExpenses.data.map(ExpenseMapper.toDTO),
    };
  }

  async delete(userId: string, id: string): Promise<void> {
    await ExpenseRepository.delete(userId, id);
  }
}
