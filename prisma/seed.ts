import { PaymentMethod, PrismaClient } from '@prisma/client';
import { fakerEN as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password:
        '3a3416272ac208c8306d086ea105efe548ddcec3b5c911727343cb5dfed13885',
    },
  });

  const banks = ['Nubank', 'Itaú', 'Bradesco', 'Santander', 'Inter', 'Caixa'];
  const accounts = await Promise.all(
    banks.map((bank, index) =>
      prisma.accounts.create({
        data: {
          name: bank,
          type: index % 2 === 0 ? 'Checking' : 'Savings',
          balance: faker.number.float({
            min: 500,
            max: 20000,
          }),
          userId: user.id,
          isDefault: index === 0,
        },
      }),
    ),
  );

  const categories = [
    'Food',
    'Transport',
    'Leisure',
    'Housing',
    'Health',
    'Education',
  ];

  for (let i = 0; i < 20; i++) {
    const isInstallment = faker.datatype.boolean();
    const totalInstallments = isInstallment
      ? faker.number.int({ min: 2, max: 12 })
      : 1;
    const amount = faker.number.float({ min: 50, max: 1000 });
    const installmentAmount = amount / totalInstallments;
    const dueDate = faker.date.past({ years: 0.2 });

    const expense = await prisma.expenses.create({
      data: {
        amount,
        category: faker.helpers.arrayElement(categories),
        date: dueDate,
        isPaid: faker.datatype.boolean(),
        description: faker.commerce.productName(),
        userId: user.id,
        isRecurring: faker.datatype.boolean(),
      },
    });

    for (let j = 0; j < totalInstallments; j++) {
      const installment = await prisma.expenseInstallments.create({
        data: {
          expenseId: expense.id,
          amount: installmentAmount,
          dueDate: new Date(
            dueDate.getFullYear(),
            dueDate.getMonth() + j,
            dueDate.getDate(),
          ),
          installmentNumber: j + 1,
          totalInstallments,
          isPaid: faker.datatype.boolean(),
        },
      });

      await prisma.transactions.create({
        data: {
          amount: installmentAmount,
          type: faker.helpers.shuffle(['EXIT', 'ENTRY'])[0],
          date: dueDate,
          description: expense.description,
          userId: user.id,
          accountId: faker.helpers.arrayElement(accounts).id,
          category: expense.category,
          paymentMethod: faker.helpers.arrayElement<PaymentMethod>([
            'CASH',
            'CREDIT_CARD',
            'DEBIT_CARD',
            'BANK_TRANSFER',
            'PIX',
          ]),
          expenseInstallmentId: installment.id,
        },
      });
    }
  }

  console.log('Seed created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
