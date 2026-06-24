const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const { verifyToken, isStaffOrAdmin } = require('../../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

router.post('/', verifyToken, isStaffOrAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isStaffOrAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isStaffOrAdmin, categoryController.deleteCategory);

module.exports = router;
