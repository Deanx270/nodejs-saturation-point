const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');
const { verifyToken } = require('../../middleware/auth');

router.post('/', verifyToken, transactionController.createTransaction);

module.exports = router;
