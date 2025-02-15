import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionDTO } from './dto/transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { TransactionMapper } from './mappers/transaction.mapper';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  async create(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<TransactionDTO> {
    const transaction = await TransactionRepository.create(userId, data);
    return TransactionMapper.toDTO(transaction);
  }

  async update(
    id: string,
    body: UpdateTransactionDTO,
  ): Promise<TransactionDTO> {
    const expenseEntity = await TransactionRepository.update(id, body);
    return TransactionMapper.toDTO(expenseEntity);
  }

  async getById(id: string): Promise<TransactionDTO> {
    const expenseEntity = await TransactionRepository.findById(id);

    if (!expenseEntity) {
      throw new Error('Expense not found');
    }

    return TransactionMapper.toDTO(expenseEntity);
  }

  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationDTO<TransactionDTO>> {
    const transactions = await TransactionRepository.getAll(
      userId,
      page,
      limit,
    );

    return {
      ...transactions,
      data: transactions.data.map(TransactionMapper.toDTO),
    };
  }

  async remove(userId: string, id: string): Promise<TransactionDTO> {
    const expenseEntity = await TransactionRepository.remove(userId, id);
    return TransactionMapper.toDTO(expenseEntity);
  }
}
