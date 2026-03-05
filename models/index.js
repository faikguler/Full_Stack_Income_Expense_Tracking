const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');


User.hasMany(Transaction, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'user_id',
});

// Category - Transaction
Category.hasMany(Transaction, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL',
});

Transaction.belongsTo(Category, {
  foreignKey: 'category_id',
});



module.exports = {
  User,
  Category,
  Transaction,
};