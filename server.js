const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection and Models
const { sequelize, initializeDatabase } = require('./models');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'premium_pen_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Static assets (Frontend)
app.use(express.static(path.join(__dirname, 'public')));
// Static route for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/admin/users', require('./routes/api/adminUsers'));
app.use('/api/admin/transactions', require('./routes/api/adminTransactions'));
app.use('/api/admin/dashboard', require('./routes/api/dashboard'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/brands', require('./routes/api/brands'));
app.use('/api/transactions', require('./routes/api/transactions'));
// Clean URL Frontend Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'The Saturation Point | Premium Fountain Pens & Stationery' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/catalog', (req, res) => {
  res.render('catalog', { title: 'Catalog' });
});

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Shopping Cart' });
});

app.get('/checkout-success', (req, res) => {
  res.render('checkout-success', { title: 'Order Confirmed' });
});

app.get('/product/:id', (req, res) => {
  res.render('product', { title: 'Product Details' });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin-dashboard', { title: 'Admin - Dashboard', activeTab: 'dashboard' });
});

app.get('/admin/users', (req, res) => {
  res.render('admin-users', { title: 'Admin - User Management', activeTab: 'users' });
});

app.get('/admin/brands', (req, res) => {
  res.render('admin-brands', { title: 'Admin - Brands', activeTab: 'brands' });
});

app.get('/admin/products', (req, res) => {
  res.render('admin-products', { title: 'Admin - Products', activeTab: 'products' });
});

app.get('/admin/categories', (req, res) => {
  res.render('admin-categories', { title: 'Admin - Categories', activeTab: 'categories' });
});

app.get('/admin/transactions', (req, res) => {
  res.render('admin-transactions', { title: 'Admin - Transactions', activeTab: 'transactions' });
});

app.get('/verification-success', (req, res) => {
  res.render('verification-success', { title: 'Verification Success' });
});

app.get('/profile', (req, res) => {
  res.render('profile', { title: 'My Profile' });
});

app.get('/404', (req, res) => {
  res.render('404', { title: 'Page Not Found' });
});

// 404 Error Handler for API
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Frontend 404 Handler
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initializeDatabase();
  
  const { User, Category } = require('./models');

  // Sync Category first and seed to prevent Foreign Key errors on Products
  await Category.sync({ alter: true });
  
  const defaultCategories = [
    { id: 'pen', name: 'Fountain Pens', description: 'Premium writing instruments' },
    { id: 'ink', name: 'Inks', description: 'High-quality fountain pen inks' },
    { id: 'paper', name: 'Paper & Notebooks', description: 'Fountain-pen friendly paper' }
  ];
  
  for (const cat of defaultCategories) {
    await Category.findOrCreate({ where: { id: cat.id }, defaults: cat });
  }

  // Sync remaining database models
  await sequelize.sync({ alter: true });
  console.log('Database synchronized successfully.');
  
  // Seed Head Admin
  const bcrypt = require('bcryptjs');
  
  const adminExists = await User.findOne({ where: { email: 'headadmin@test.com' } });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({
      firstName: 'Head',
      lastName: 'Admin',
      email: 'admin@thesaturationpoint.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'head_admin',
      status: 'active',
      profilePicture: '/images/default-avatar.png'
    });
    console.log('Head Admin seeded successfully.');
  } else {
    console.log('Head Admin already exists, skipping seed.');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
