const { Transaction, TransactionItem, Product, User, sequelize } = require('../models');
const { sendReceiptEmail } = require('../utils/mailer');
const { generateReceiptPdf } = require('../utils/pdfGenerator');

exports.createTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const transactionItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(400).json({ error: `Product ID ${item.productId} not found` });
      }

      if (item.quantity > product.stock) {
        await t.rollback();
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
      }

      totalAmount += product.price * item.quantity;
      transactionItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    const shippingFee = 150;
    totalAmount += shippingFee;

    const transaction = await Transaction.create({
      userId,
      totalAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'Credit Card'
    }, { transaction: t });

    for (const ti of transactionItemsData) {
      await TransactionItem.create({
        transactionId: transaction.id,
        productId: ti.productId,
        quantity: ti.quantity,
        price: ti.priceAtPurchase
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Transaction successful', transaction });

  } catch (error) {
    await t.rollback();
    console.error('Transaction Error:', error);
    res.status(500).json({ error: 'An error occurred during checkout' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: TransactionItem, include: [Product] }
      ]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: TransactionItem, include: [Product] }
      ]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching my transactions:', error);
    res.status(500).json({ error: 'Failed to fetch your transactions' });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: User },
        { model: TransactionItem, include: [Product] }
      ],
      transaction: t
    });

    if (!transaction) {
      await t.rollback();
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid order status. Stop tampering with the payload.' });
    }

    if (transaction.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot modify a cancelled order' });
    }

    if (transaction.status === 'delivered') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot modify an order that has already been delivered.' });
    }

    if (status === 'delivered' && transaction.status !== 'shipped') {
      await t.rollback();
      return res.status(400).json({ error: 'An order must be shipped before it can be delivered.' });
    }

    if (status === 'pending' && transaction.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot revert an order back to pending.' });
    }

    if (status === 'cancelled') {
      for (const item of transaction.TransactionItems) {
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction: t });
        }
      }
    }

    transaction.status = status;
    await transaction.save({ transaction: t });

    await t.commit();
    res.json({ message: 'Transaction status updated successfully', transaction });

    if (status === 'shipped' || status === 'delivered' || status === 'cancelled') {
      if (transaction.User && transaction.User.email) {
        const firstName = transaction.User.firstName || 'Customer';
        const pdfPromise = status === 'delivered' ? generateReceiptPdf(transaction) : Promise.resolve(null);
        
        pdfPromise
          .then(pdfBuffer => {
            return sendReceiptEmail(transaction.User.email, firstName, status, transaction.id, pdfBuffer);
          })
          .then(() => {
            console.log(`Receipt email sent successfully for order ${transaction.id}`);
          })
          .catch(error => {
            console.error('Failed to send receipt email:', error);
          });
      }
    }

  } catch (error) {
    await t.rollback();
    console.error('Error updating transaction status:', error);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};
