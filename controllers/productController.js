const { Product, Brand } = require('../models');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12; // default 12 per page
    const offset = (page - 1) * limit;

    const { Op } = require('sequelize');
    const { search, categoryId, brandId, sort, minPrice, maxPrice } = req.query;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (brandId) {
      where.brandId = brandId;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') {
      order = [['price', 'ASC']];
    } else if (sort === 'price_desc') {
      order = [['price', 'DESC']];
    }

    const products = await Product.findAll({
      where: where,
      order: order,
      limit: limit,
      offset: offset,
      include: [{ model: Brand, as: 'Brand' }]
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

// @desc    Search products by name
// @route   GET /api/products/search?q=
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const { Op } = require('sequelize');
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${q}%`
        }
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error searching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { Review, User } = require('../models');
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Brand, as: 'Brand' },
        { 
          model: Review, 
          include: [{ model: User, attributes: ['firstName', 'lastName', 'profilePicture'] }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Calculate average rating
    let averageRating = 0;
    if (product.Reviews && product.Reviews.length > 0) {
      const sum = product.Reviews.reduce((acc, rev) => acc + rev.rating, 0);
      averageRating = (sum / product.Reviews.length).toFixed(1);
    }
    
    const prodData = product.toJSON();
    prodData.averageRating = averageRating;

    res.json(prodData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const { Review, Transaction, TransactionItem } = require('../models');

    // 1. Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 2. Strict Validation: User must have a transaction containing this productId with status 'delivered'
    const hasPurchased = await Transaction.findOne({
      where: { userId, status: 'delivered' },
      include: [{
        model: TransactionItem,
        where: { productId },
        required: true
      }]
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: 'You can only review products you have purchased and received.' });
    }

    // 3. Check for existing review to update
    const existingReview = await Review.findOne({ where: { userId, productId } });
    
    const { censorFoulWords } = require('../utils/censor');
    const censoredComment = censorFoulWords(comment);
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = censoredComment;
      await existingReview.save();
      return res.json({ message: 'Review updated successfully', review: existingReview });
    }

    // 4. Create Review
    const review = await Review.create({
      rating,
      comment: censoredComment,
      userId,
      productId
    });

    res.status(201).json({ message: 'Review added successfully', review });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding review' });
  }
};

exports.checkCanReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { Transaction, TransactionItem, Review } = require('../models');

    // 1. Check if already reviewed
    const existingReview = await Review.findOne({ where: { userId, productId } });
    if (existingReview) {
      return res.json({ canReview: false, reason: 'already_reviewed', existingReview });
    }

    // 2. Check if purchased and delivered
    const hasPurchased = await Transaction.findOne({
      where: { userId, status: 'delivered' },
      include: [{
        model: TransactionItem,
        where: { productId },
        required: true
      }]
    });

    if (hasPurchased) {
      return res.json({ canReview: true });
    } else {
      return res.json({ canReview: false, reason: 'not_purchased' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, brandId } = req.body;
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/images/uploads/${file.filename}`);
    }

    const product = await Product.create({
      name, description, price, stock, categoryId, brandId, images: imagePaths
    });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, brandId, imageOrder } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let finalImages = product.images || [];

    if (imageOrder) {
      try {
        const orderArr = JSON.parse(imageOrder);
        const newFiles = req.files ? req.files.map(f => `/images/uploads/${f.filename}`) : [];
        let newFileCounter = 0;
        finalImages = [];

        orderArr.forEach(item => {
          if (item === 'new') {
            if (newFiles[newFileCounter]) {
              finalImages.push(newFiles[newFileCounter]);
              newFileCounter++;
            }
          } else {
            finalImages.push(item);
          }
        });
      } catch (e) {
        console.error("Error parsing imageOrder", e);
      }
    } else {
      // Fallback
      if (req.files && req.files.length > 0) {
        finalImages = req.files.map(file => `/images/uploads/${file.filename}`);
      }
    }

    await product.update({
      name, description, price, stock, categoryId, brandId, images: finalImages
    });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
};
