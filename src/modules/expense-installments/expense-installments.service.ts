import { Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ExpenseInstallmentRepository } from './expense-installments.repository';
import { ExpenseInstallmentsMapper } from './mappers/expense-installments.mapper';
import { ExpenseInstallmentDTO } from './dto/expense-installment.dto';
import { FiltersExpenseInstallmentsDTO } from './dto/filters-expense-installments.dto';

@Injectable()
export class ExpenseInstallmentsService {
  async getAll(
    userId: string,
    filters: FiltersExpenseInstallmentsDTO,
  ): Promise<PaginationDTO<ExpenseInstallmentDTO>> {
    const result = await ExpenseInstallmentRepository.findAll(userId, filters);

    return {
      ...result,
      data: result.data.map(ExpenseInstallmentsMapper.toDTO),
    };
  }
}
