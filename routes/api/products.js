const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const { verifyToken, isStaffOrAdmin } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);

router.get('/:id/can-review', verifyToken, productController.checkCanReview);
router.post('/:id/reviews', verifyToken, productController.addReview);

router.get('/:id', productController.getProductById);

router.post('/', verifyToken, isStaffOrAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, isStaffOrAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyToken, isStaffOrAdmin, productController.deleteProduct);

module.exports = router;
