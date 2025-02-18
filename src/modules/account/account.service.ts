import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { AccountDTO } from './dto/account.dto';
import { AccountMapper } from './mappers/account.mapper';

@Injectable()
export class AccountService {
  static async create(
    userId: string,
    body: CreateAccountDTO,
  ): Promise<AccountDTO> {
    const account = await AccountRepository.create(userId, body);
    return AccountMapper.toDTO(account);
  }

  static async findAll(userId: string): Promise<AccountDTO[]> {
    return AccountRepository.findAll(userId);
  }

  static async findOne(userId: string, id: string): Promise<AccountDTO> {
    return AccountRepository.findOne(userId, id);
  }

  static async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDTO,
  ): Promise<AccountDTO> {
    return AccountRepository.update(userId, id, updateAccountDto);
  }

  static async delete(userId: string, id: string): Promise<void> {
    return AccountRepository.delete(userId, id);
  }
}
