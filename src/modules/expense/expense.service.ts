import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
import { ExpenseMapper } from './mappers/expense.mapper';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ExpenseDTO } from './dto/expense.dto';
import { ExpenseInstallmentRepository } from '../expense-installments/expense-installments.repository';
import { TransactionRepository } from '../transaction/transaction.repository';
import { AccountRepository } from '../account/account.repository';
import { ExpenseMarkPaidDTO } from './dto/expense-mark-paid.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  async create(userId: string, body: CreateExpenseDTO) {
    const expenseEntity = await ExpenseRepository.create(userId, body);
    return ExpenseMapper.toDTO(expenseEntity);
  }

  async update(id: string, body: UpdateExpenseDTO) {
    const expenseEntity = await ExpenseRepository.update(id, body);
    return ExpenseMapper.toDTO(expenseEntity);
  }

  async getById(id: string): Promise<ExpenseDTO> {
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

  async markAsPaid(
    userId: string,
    expenseId: string,
    data: ExpenseMarkPaidDTO,
  ): Promise<void> {
    const expense = await ExpenseRepository.findOne(expenseId);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await ExpenseRepository.update(expense.id, {
      isPaid: true,
    });

    const accountId = await AccountRepository.findDefault(userId);

    await TransactionRepository.create(userId, {
      accountId: accountId.id,
      amount: expense.amount,
      description: expense.description,
      type: 'EXIT',
      categoryId: expense.category.id,
      date: data.paymentDate,
      expenseId: expense.id,
    });

    await ExpenseInstallmentRepository.updateByExpenseId(expense.id, {
      isPaid: true,
      paymentDate: data.paymentDate,
    });
  }

  async markInstallmentAsPaid(
    userId: string,
    installmentId: string,
    data: ExpenseMarkPaidDTO,
  ): Promise<void> {
    const installment =
      await ExpenseInstallmentRepository.findOne(installmentId);

    if (!installment) {
      throw new NotFoundException('Expense not found');
    }

    const expense = await ExpenseRepository.findOne(installment.expenseId);

    await TransactionRepository.create(userId, {
      accountId: data.accountId,
      amount: expense.amount,
      description: expense.description,
      type: 'EXIT',
      categoryId: expense.category.id,
      date: data.paymentDate,
      expenseId: expense.id,
    });

    await ExpenseInstallmentRepository.update(installment.id, {
      isPaid: true,
      paymentDate: data.paymentDate,
    });

    const installments =
      await ExpenseInstallmentRepository.findNoPaidByExpenseId(expense.id);

    if (installments.length === 0) {
      await ExpenseRepository.update(expense.id, {
        isPaid: true,
      });
    }
  }
}
