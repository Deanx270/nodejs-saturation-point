const express = require('express');
const router = express.Router();
const dashboardController = require('../../../controllers/admin/dashboardController');
const { verifyToken, isAdmin } = require('../../../middleware/auth');

router.get('/stats', verifyToken, isAdmin, dashboardController.getDashboardStats);

module.exports = router;
