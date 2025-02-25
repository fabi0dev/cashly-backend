import { Module } from '@nestjs/common';
import { ExpenseInstallmentsService } from './expense-installments.service';
import { ExpenseInstallmentsController } from './expense-installments.controller';

@Module({
  controllers: [ExpenseInstallmentsController],
  providers: [ExpenseInstallmentsService],
})
export class ExpenseInstallmentsModule {}
