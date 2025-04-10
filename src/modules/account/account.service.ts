import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { AccountDTO } from './dto/account.dto';
import { AccountMapper } from './mappers/account.mapper';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { TransactionRepository } from '../transaction/transaction.repository';

@Injectable()
export class AccountService {
  static async create(
    userId: string,
    body: CreateAccountDTO,
  ): Promise<AccountDTO> {
    const account = await AccountRepository.create(userId, body);

    await TransactionRepository.create(userId, {
      accountId: account.id,
      amount: body.balance,
      categoryId: null,
      description: 'Saldo inicial da conta (automático)',
      date: new Date(),
      type: 'ENTRY',
    });

    return AccountMapper.toDTO(account);
  }

  static async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationDTO<AccountDTO>> {
    await AccountRepository.recalculateBalances(userId);
    const accounts = await AccountRepository.findAll(userId, page, limit);

    return {
      ...accounts,
      data: accounts.data.map(AccountMapper.toDTO),
    };
  }

  static async findOne(userId: string, id: string): Promise<AccountDTO> {
    const account = await AccountRepository.findOne(userId, id);
    if (!account) throw new NotFoundException('Account not found');

    return AccountMapper.toDTO(account);
  }

  static async update(
    userId: string,
    id: string,
    data: UpdateAccountDTO,
  ): Promise<AccountDTO> {
    const account = await AccountRepository.update(userId, id, data);
    return AccountMapper.toDTO(account);
  }

  static async delete(userId: string, id: string): Promise<void> {
    return AccountRepository.delete(userId, id);
  }
}
