import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criando um usuário
  const user = await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password:
        '3a3416272ac208c8306d086ea105efe548ddcec3b5c911727343cb5dfed13885',
    },
  });

  // Criando despesas
  await prisma.expenses.create({
    data: {
      amount: 50.0,
      category: 'Food',
      date: new Date(),
      dueDate: new Date(),
      description: 'Lunch',
      userId: user.id,
      isRecurring: false,
    },
  });

  // Criando orçamentos
  await prisma.budgets.create({
    data: {
      category: 'Entertainment',
      limit: 200.0,
      startDate: new Date(),
      endDate: new Date(),
      userId: user.id,
    },
  });

  // Criando metas
  await prisma.goals.create({
    data: {
      name: 'Vacation Fund',
      target: 1500.0,
      deadline: new Date('2025-12-31'),
      userId: user.id,
    },
  });

  // Criando contas
  const account = await prisma.accounts.create({
    data: {
      name: 'PicPay',
      type: 'Checking',
      balance: 1000.0,
      userId: user.id,
    },
  });

  // Criando transações
  await prisma.transactions.create({
    data: {
      amount: 100.0,
      type: 'ENTRY',
      description: 'Shopping',
      userId: user.id,
      accountId: account.id,
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
