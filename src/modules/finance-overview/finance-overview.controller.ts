import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { JwtPayload } from 'src/types/jwt-payload';
import { FinanceOverviewService } from './finance-overview.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { FinanceSummaryDTO } from './dto/finance-summary.dto';
import { ExpenseDistributionDTO } from './dto/expense-distribution.dto';

@Controller('finance-overview')
@UseGuards(AuthGuard)
export class FinanceOverviewController {
  constructor(private readonly financeService: FinanceOverviewService) {}

  @Get('summary')
  async getFinanceSummary(
    @JwtDecode() tokenData: JwtPayload,
  ): Promise<FinanceSummaryDTO> {
    return await this.financeService.getFinanceSummary(tokenData.userId);
  }

  @Get('expense-distribution')
  async getExpenseDistribution(
    @JwtDecode() tokenData: JwtPayload,
    @Query('lastDays') lastDays: string,
  ): Promise<ExpenseDistributionDTO[]> {
    return await this.financeService.getExpenseDistribution(
      tokenData.userId,
      Number(lastDays),
    );
  }
}
