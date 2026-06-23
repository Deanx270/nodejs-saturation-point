const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const { verifyToken, isAdmin } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Public route for catalog
router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);
// Reviews
router.get('/:id/can-review', verifyToken, productController.checkCanReview);
router.post('/:id/reviews', verifyToken, productController.addReview);

router.get('/:id', productController.getProductById);

// Admin Protected Routes
router.post('/', verifyToken, isAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
