import { Module } from '@nestjs/common';
import { FinanceOverviewService } from './finance-overview.service';
import { FinanceOverviewController } from './finance-overview.controller';

@Module({
  controllers: [FinanceOverviewController],
  providers: [FinanceOverviewService],
})
export class FinanceOverviewModule {}
