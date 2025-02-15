import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtDecode } from 'src/decorators/jwt-decoded.decorator';
import { JwtPayload } from 'src/types/jwt-payload';
import { FinanceOverviewService } from './finance-overview.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('finance-overview')
@UseGuards(AuthGuard)
export class FinanceOverviewController {
  constructor(private readonly financeService: FinanceOverviewService) {}

  @Get('summary')
  async getFinanceSummary(@JwtDecode() tokenData: JwtPayload) {
    return this.financeService.getFinanceSummary(tokenData.userId);
  }
}
