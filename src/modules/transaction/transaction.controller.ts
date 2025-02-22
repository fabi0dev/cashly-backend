import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionDTO } from './dto/transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionService } from './transaction.service';
import { JwtPayload } from 'src/types/jwt-payload';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { ProhibitedPaginationDTO } from 'src/dto/pagination-prohibited.dto';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body() body: CreateTransactionDTO,
  ): Promise<TransactionDTO> {
    return await this.transactionService.create(jwtPayload.userId, body);
  }

  @Get()
  async findAll(
    @JwtDecode() jwtPayload: JwtPayload,
    @Query() pagination: ProhibitedPaginationDTO,
  ): Promise<PaginationDTO<TransactionDTO>> {
    return await this.transactionService.getAll(
      jwtPayload.userId,
      pagination.page,
      pagination.limit,
    );
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
