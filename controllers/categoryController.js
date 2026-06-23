const { Category, Product } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product, attributes: ['id'] }]
    });
    
    // Add product count
    const formattedCategories = categories.map(cat => {
      const data = cat.toJSON();
      data.productCount = data.Products ? data.Products.length : 0;
      delete data.Products;
      return data;
    });
    
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    
    // Validate ID format (slug)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(id)) {
      return res.status(400).json({ error: 'ID must contain only lowercase letters, numbers, and hyphens' });
    }

    const existing = await Category.findByPk(id);
    if (existing) {
      return res.status(400).json({ error: 'A category with this ID already exists' });
    }

    const category = await Category.create({ id, name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // Explicitly destructure ONLY name and description. Ignore req.body.id completely.
    const { name, description } = req.body;
    
    // Extract target ID strictly from URL parameter
    const targetId = req.params.id;
    const category = await Category.findByPk(targetId);
    
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    
    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    // Check if products are associated
    const productsCount = await Product.count({ where: { categoryId: category.id } });
    if (productsCount > 0) {
      return res.status(400).json({ error: `Cannot delete category: ${productsCount} products are assigned to it.` });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
