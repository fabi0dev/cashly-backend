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
import { AccountDTO } from './dto/account.dto';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { JwtPayload } from 'src/types/jwt-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateAccountDTO } from './dto/update-account.dto';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  @Post()
  async create(
    @JwtDecode() { userId }: JwtPayload,
    @Body() body: CreateAccountDTO,
  ): Promise<AccountDTO> {
    return await AccountService.create(userId, body);
  }

  @Put(':id')
  async update(
    @JwtDecode() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDTO,
  ): Promise<AccountDTO> {
    return await AccountService.update(userId, id, updateAccountDto);
  }

  @Get()
  async findAll(@JwtDecode() { userId }: JwtPayload): Promise<AccountDTO[]> {
    return await AccountService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @JwtDecode() { userId }: JwtPayload,
    @Param('id') id: string,
  ): Promise<AccountDTO> {
    return await AccountService.findOne(userId, id);
  }

  @Delete(':id')
  async delete(
    @JwtDecode() { userId }: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return await AccountService.delete(userId, id);
  }
}
