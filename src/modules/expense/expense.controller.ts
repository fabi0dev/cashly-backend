import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { JwtPayload } from 'src/types/jwt-payload';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { ProhibitedPaginationDTO } from 'src/dto/pagination-prohibited.dto';
import { ExpenseMarkPaidDTO } from './dto/expense-mark-paid.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@JwtDecode() { userId }: JwtPayload, @Body() body: CreateExpenseDTO) {
    return this.expenseService.create(userId, body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateExpenseDTO) {
    return this.expenseService.update(id, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @JwtDecode() { userId }: JwtPayload,
  ): Promise<void> {
    return await this.expenseService.delete(userId, id);
  }

  @Get()
  findAll(
    @JwtDecode() { userId }: JwtPayload,
    @Query() pagination: ProhibitedPaginationDTO,
  ) {
    return this.expenseService.getAll(
      userId,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('-/installments')
  findAllInstallments(
    @JwtDecode() { userId }: JwtPayload,
    @Query() pagination: ProhibitedPaginationDTO,
  ) {
    return this.expenseService.getAll(
      userId,
      pagination.page,
      pagination.limit,
    );
  }

  @Patch('mark-paid/:expenseId')
  async markPaid(
    @Param('expenseId') expenseId: string,
    @JwtDecode() { userId }: JwtPayload,
    @Body() body: ExpenseMarkPaidDTO,
  ) {
    return this.expenseService.markAsPaid(userId, expenseId, body);
  }

  @Patch('installment/mark-paid/:expenseId')
  async markInstallmentPaid(
    @Param('expenseId') expenseId: string,
    @JwtDecode() { userId }: JwtPayload,
    @Body() body: ExpenseMarkPaidDTO,
  ) {
    return this.expenseService.markInstallmentAsPaid(userId, expenseId, body);
  }
}
