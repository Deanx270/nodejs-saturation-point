const { Brand } = require('../models');

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      order: [['name', 'ASC']]
    });
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching brands' });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching brand' });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, origin, description, status } = req.body;
    const brand = await Brand.create({ name, origin, description, status });
    res.status(201).json({ message: 'Brand created successfully', brand });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Brand name already exists' });
    }
    res.status(500).json({ error: 'Server error creating brand' });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { name, origin, description, status } = req.body;
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    await brand.update({ name, origin, description, status });
    res.json({ message: 'Brand updated successfully', brand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating brand' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    
    await brand.destroy();
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting brand. Ensure no products are attached to it.' });
  }
};
