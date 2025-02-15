import { Injectable } from '@nestjs/common';
import { FinanceSummaryDTO } from './dto/finance-summary.dto';
import { prisma } from 'src/services/prisma.service';

@Injectable()
export class FinanceOverviewService {
  async getFinanceSummary(userId: string): Promise<FinanceSummaryDTO> {
    const totalEntries = await prisma.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        type: 'ENTRY',
      },
    });

    const totalExits = await prisma.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        type: 'EXIT',
      },
    });

    return {
      totalBalance: totalEntries._sum.amount - totalExits._sum.amount || 0,
      totalExits: totalExits._sum.amount || 0,
      totalEntries: totalEntries._sum.amount || 0,
    };
  }
}
