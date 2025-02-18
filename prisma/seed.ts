import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criação de um usuário
  const user = await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password:
        '3a3416272ac208c8306d086ea105efe548ddcec3b5c911727343cb5dfed13885',
    },
  });

  // Criação de contas para o usuário
  const account = await prisma.accounts.create({
    data: {
      name: 'Personal Account',
      type: 'Checking',
      balance: 1000.0,
      userId: user.id,
    },
  });

  // Criação de uma despesa (expense) para o usuário
  const expense = await prisma.expenses.create({
    data: {
      amount: 500.0,
      category: 'Rent',
      date: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      userId: user.id,
      isRecurring: true,
      recurrenceType: 'MONTHLY',
    },
  });

  // Criação de parcelas de despesa (expense installments)
  await prisma.expenseInstallments.createMany({
    data: [
      {
        expenseId: expense.id,
        amount: 125.0,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        installmentNumber: 1,
        totalInstallments: 4,
      },
      {
        expenseId: expense.id,
        amount: 125.0,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        installmentNumber: 2,
        totalInstallments: 4,
      },
      {
        expenseId: expense.id,
        amount: 125.0,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        installmentNumber: 3,
        totalInstallments: 4,
      },
      {
        expenseId: expense.id,
        amount: 125.0,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        installmentNumber: 4,
        totalInstallments: 4,
      },
    ],
  });

  await prisma.transactions.create({
    data: {
      amount: 125.0,
      type: 'EXIT',
      date: new Date(),
      userId: user.id,
      accountId: account.id,
      paymentMethod: 'CREDIT_CARD',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
