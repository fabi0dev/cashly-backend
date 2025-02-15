import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionDTO } from './dto/transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionService } from './transaction.service';
import { JwtPayload } from 'src/types/jwt-payload';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { PaginationDTO } from 'src/dto/pagination.dto';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @JwtDecode() tokenData: JwtPayload,
    @Body() body: CreateTransactionDTO,
  ): Promise<TransactionDTO> {
    return await this.transactionService.create(tokenData.userId, body);
  }

  @Get()
  async findAll(
    @JwtDecode() tokenData: JwtPayload,
  ): Promise<PaginationDTO<TransactionDTO>> {
    return await this.transactionService.getAll(tokenData.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TransactionDTO> {
    return await this.transactionService.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: CreateTransactionDTO,
  ): Promise<TransactionDTO> {
    return await this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(
    @JwtDecode() tokenData: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.transactionService.remove(tokenData.userId, id);
  }
}
