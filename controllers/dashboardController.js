const { Transaction, TransactionItem, Product, Category, sequelize } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Revenue by Month (Line Chart)
    const revenueData = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        status: ['shipped', 'delivered'] // Only count realized revenue
      },
      group: ['month'],
      order: [['month', 'ASC']]
    });

    // 2. Products by Category (Bar Chart)
    const productsByCategory = await Category.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('Products.id')), 'count']
      ],
      include: [{
        model: Product,
        attributes: []
      }],
      group: ['Category.id'],
      raw: true
    });

    // 3. Transactions by Status (Pie Chart)
    const transactionsByStatus = await Transaction.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // 4. KPI Stats
    const { Op } = require('sequelize');
    const totalRevenueResult = await Transaction.sum('totalAmount', { where: { status: { [Op.ne]: 'cancelled' } } });
    const totalRevenue = totalRevenueResult || 0;
    
    const totalOrders = await Transaction.count();
    const activeProducts = await Product.count();
    const { User } = require('../models');
    const totalUsers = await User.count({ where: { role: 'customer' } });

    res.json({
      revenue: revenueData,
      categories: productsByCategory,
      statusDistribution: transactionsByStatus,
      kpis: {
        totalRevenue,
        totalOrders,
        activeProducts,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
