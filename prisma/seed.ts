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

  // Criando uma conta
  await prisma.accounts.create({
    data: {
      name: 'Main Account',
      type: 'Checking',
      balance: 1000,
      userId: user.id,
    },
  });

  // Criando uma despesa
  await prisma.expenses.create({
    data: {
      amount: 50,
      category: 'Food',
      description: 'Lunch at restaurant',
      userId: user.id,
    },
  });

  // Criando uma receita
  await prisma.incomes.create({
    data: {
      amount: 1500,
      source: 'Salary',
      description: 'Monthly salary',
      userId: user.id,
    },
  });

  // Criando um orçamento
  await prisma.budgets.create({
    data: {
      category: 'Groceries',
      limit: 200,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      userId: user.id,
    },
  });

  // Criando uma meta
  await prisma.goals.create({
    data: {
      name: 'Vacation Fund',
      target: 5000,
      current: 200,
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      userId: user.id,
    },
  });

  // Criando um investimento
  await prisma.investments.create({
    data: {
      amount: 500,
      type: 'Stocks',
      description: 'Invested in tech stocks',
      userId: user.id,
    },
  });

  console.log('Data seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
