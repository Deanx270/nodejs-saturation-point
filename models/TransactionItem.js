const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TransactionItem = sequelize.define('TransactionItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false, // Foreign key
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false, // Foreign key
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'transaction_items',
});

module.exports = TransactionItem;
