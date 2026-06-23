const { sequelize, initializeDatabase } = require('../config/db');

const User = require('./User');
const Brand = require('./Brand');
const Product = require('./Product');
const Transaction = require('./Transaction');
const TransactionItem = require('./TransactionItem');
const Category = require('./Category');
const Review = require('./Review');

// Associations

// Brand <-> Product (One to Many)
Brand.hasMany(Product, { foreignKey: 'brandId', onDelete: 'RESTRICT' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });

// Category <-> Product (One to Many)
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// User <-> Transaction (One to Many)
User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'RESTRICT' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// Transaction <-> TransactionItem (One to Many)
Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', onDelete: 'CASCADE' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId' });

// Product <-> TransactionItem (One to Many)
Product.hasMany(TransactionItem, { foreignKey: 'productId', onDelete: 'RESTRICT' });
TransactionItem.belongsTo(Product, { foreignKey: 'productId' });

// User <-> Review (One to Many)
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Product <-> Review (One to Many)
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  initializeDatabase,
  User,
  Brand,
  Product,
  Category,
  Transaction,
  TransactionItem,
  Review
};
