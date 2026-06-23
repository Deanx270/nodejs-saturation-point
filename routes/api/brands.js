const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brandController');
const { verifyToken, isAdmin } = require('../../middleware/auth');

// Public route for fetching brands
router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);

// Admin Protected Routes
router.post('/', verifyToken, isAdmin, brandController.createBrand);
router.put('/:id', verifyToken, isAdmin, brandController.updateBrand);
router.delete('/:id', verifyToken, isAdmin, brandController.deleteBrand);

module.exports = router;
