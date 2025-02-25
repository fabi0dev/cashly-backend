import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { JwtPayload } from 'src/types/jwt-payload';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { ProhibitedPaginationDTO } from 'src/dto/pagination-prohibited.dto';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@JwtDecode() tokenData: JwtPayload, @Body() body: CreateExpenseDTO) {
    return this.expenseService.create(tokenData.userId, body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreateExpenseDTO) {
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
    @JwtDecode() tokenData: JwtPayload,
    @Query() pagination: ProhibitedPaginationDTO,
  ) {
    return this.expenseService.getAll(
      tokenData.userId,
      pagination.page,
      pagination.limit,
    );
  }
}
