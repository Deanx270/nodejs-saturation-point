const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brandController');
const { verifyToken, isStaffOrAdmin } = require('../../middleware/auth');

router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);

router.post('/', verifyToken, isStaffOrAdmin, brandController.createBrand);
router.put('/:id', verifyToken, isStaffOrAdmin, brandController.updateBrand);
router.delete('/:id', verifyToken, isStaffOrAdmin, brandController.deleteBrand);

module.exports = router;
