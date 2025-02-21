import { Injectable } from '@nestjs/common';
import { FinanceSummaryDTO } from './dto/finance-summary.dto';
import { prisma } from 'src/services/prisma.service';
import { ExpenseDistributionDTO } from './dto/expense-distribution.dto';
import { DateTime } from 'luxon';

@Injectable()
export class FinanceOverviewService {
  async getFinanceSummary(userId: string): Promise<FinanceSummaryDTO> {
    const now = DateTime.local();
    const firstDayOfMonth = now.startOf('month').toJSDate();
    const lastDayOfMonth = now.endOf('month').toJSDate();

    const totalEntries = await prisma.transactions.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'ENTRY',
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    const totalExits = await prisma.transactions.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'EXIT',
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    return {
      totalBalance:
        (totalEntries._sum.amount || 0) - (totalExits._sum.amount || 0),
      totalExits: totalExits._sum.amount || 0,
      totalEntries: totalEntries._sum.amount || 0,
    };
  }

  async getExpenseDistribution(
    userId: string,
    days?: number,
  ): Promise<ExpenseDistributionDTO[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days || 30));

    const expenses = await prisma.transactions.findMany({
      where: {
        userId,
        deletedAt: null,
        type: 'EXIT',
        date: {
          gte: startDate,
        },
      },
    });

    const expenseDistribution = expenses.reduce(
      (acc, expense) => {
        const category = expense.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(expenseDistribution)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}
