import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { FinanceOverviewModule } from './modules/finance-overview/finance-overview.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AccountModule } from './modules/account/account.module';
import { CategoryModule } from './modules/category/category.module';
import { ReadExtractModule } from './modules/read-extract/read-extract.module';
import { ExpenseInstallmentsModule } from './modules/expense-installments/expense-installments.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    UserModule,
    ExpenseModule,
    FinanceOverviewModule,
    TransactionModule,
    AccountModule,
    CategoryModule,
    ReadExtractModule,
    ExpenseInstallmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
