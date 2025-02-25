import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtPayload } from 'src/types/jwt-payload';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { ExpenseInstallmentsService } from './expense-installments.service';
import { FiltersExpenseInstallmentsDTO } from './dto/filters-expense-installments.dto';

@Controller('expense-installments')
@UseGuards(AuthGuard)
export class ExpenseInstallmentsController {
  constructor(private readonly expenseService: ExpenseInstallmentsService) {}

  @Get()
  findAllInstallments(
    @JwtDecode() tokenData: JwtPayload,
    @Query() filters: FiltersExpenseInstallmentsDTO,
  ) {
    return this.expenseService.getAll(tokenData.userId, filters);
  }
}
