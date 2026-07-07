const express = require('express');
const router = express.Router();
const transactionController = require('../../../controllers/transactionController');
const { verifyToken, isAdmin } = require('../../../middleware/auth');

router.get('/', verifyToken, isAdmin, transactionController.getAllTransactions);
router.put('/:id/status', verifyToken, isAdmin, transactionController.updateTransactionStatus);

module.exports = router;
