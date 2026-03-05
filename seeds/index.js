const sequelize = require('../config/connection');
const { User, Category, Transaction } = require('../models');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log('Database synced!');

  // Create a user
  const user = await User.create({
    username: 'testuser',
    email: 'test@test.com',
    password: '123456',
  });
  console.log('User created');

  // Create categories
  const categories = await Category.bulkCreate([
    { name: 'Salary', type: 'income' },
    { name: 'Consulting', type: 'income' },
    { name: 'Product Sales', type: 'income' },
    { name: 'Fuel', type: 'expense' },
    { name: 'Food', type: 'expense' },
    { name: 'Rent', type: 'expense' },
    { name: 'Bills', type: 'expense' },
  ]);
  console.log('Categories created');

  // Create transactions
  await Transaction.bulkCreate([
    {
      description: 'January Salary',
      amount: 5000,
      type: 'income',
      date: '2026-02-01',
      user_id: user.id,
      category_id: categories[0].id,
    },
    {
      description: 'Website Development',
      amount: 2500,
      type: 'income',
      date: '2026-02-20',
      user_id: user.id,
      category_id: categories[1].id,
    },
    {
      description: 'Sale of 10 Cameras',
      amount: 8000,
      type: 'income',
      date: '2026-02-05',
      user_id: user.id,
      category_id: categories[2].id,
    },
    {
      description: 'Vehicle Fuel',
      amount: 800,
      type: 'expense',
      date: '2026-01-18',
      user_id: user.id,
      category_id: categories[3].id,
    },
    {
      description: 'Office Rent',
      amount: 1500,
      type: 'expense',
      date: '2026-02-01',
      user_id: user.id,
      category_id: categories[5].id,
    },
  ]);
  console.log('Transactions created');

  process.exit(0);
};

seedDatabase();