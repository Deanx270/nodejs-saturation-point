# Grading Reviewer Guide

This guide maps the curriculum requirements to the actual files in this project that implement them.

### 1. Machine Problems (MP1, MP2, MP7) - NodeJS CRUD & Sequelize ORM
* **MP1 & MP2: NodeJS CRUD APIs for Products and Brands**
  * Products Controller: [controllers/productController.js](./controllers/productController.js)
  * Brands Controller: [controllers/brandController.js](./controllers/brandController.js)
* **MP7: Sequelize ORM usage across the app for CRUD functions**
  * Sequelize Models Index: [models/index.js](./models/index.js)
  * Product Model: [models/Product.js](./models/Product.js)
  * Brand Model: [models/Brand.js](./models/Brand.js)

### 2. Frontend CRUD & Multiple File Uploads (MP3, MP4, Quiz 4)
* **MP3: CRUD jQuery/DataTables and multiple file uploads (for Products)**
  * Admin Products View: [views/admin/products.ejs](./views/admin/products.ejs)
  * Admin Products Frontend JS: [public/js/admin/products.js](./public/js/admin/products.js)
* **MP4: CRUD jQuery/DataTables frontend (for Brands)**
  * Admin Brands View: [views/admin/brands.ejs](./views/admin/brands.ejs)
  * Admin Brands Frontend JS: [public/js/admin/brands.js](./public/js/admin/brands.js)
* **Quiz 4: jQuery validation implementation for these forms**
  * Form validation is implemented in the respective frontend scripts: [public/js/admin/products.js](./public/js/admin/products.js) and [public/js/admin/brands.js](./public/js/admin/brands.js).

### 3. Authentication & User Management (MP5, MP6, Quiz 6)
* **MP5: Generate and send tokens for authentication, save token on users table**
  * Auth Controller: [controllers/authController.js](./controllers/authController.js)
  * User Model: [models/User.js](./models/User.js)
* **MP6: User registration, Login API via jQuery AJAX. Admin can update role of user and deactivate users. List users on DataTable (NodeJS)**
  * User Registration/Login Frontend JS: [public/js/auth.js](./public/js/auth.js)
  * Admin User Management Controller: [controllers/adminUserController.js](./controllers/adminUserController.js)
  * Admin Users View: [views/admin/users.ejs](./views/admin/users.ejs)
  * Admin Users Frontend JS: [public/js/admin/users.js](./public/js/admin/users.js)
* **Quiz 6: Route protection. Middleware to check a user's role**
  * Auth Middleware: [middleware/auth.js](./middleware/auth.js)

### 4. Transactions, PDF & Email (Term Test Lab)
* **Transactions CRUD API and jQuery frontend (Shopping Cart & Checkout)**
  * Transaction Controller: [controllers/transactionController.js](./controllers/transactionController.js)
  * Cart View: [views/cart.ejs](./views/cart.ejs)
  * Cart Frontend JS: [public/js/cart.js](./public/js/cart.js)
* **Send an email when updating the transaction, attach the receipt with order details in PDF**
  * Mailer Utility: [utils/mailer.js](./utils/mailer.js)
  * PDF Generator Utility: [utils/pdfGenerator.js](./utils/pdfGenerator.js)

### 5. Advanced Frontend Features (Quiz 5, Quiz 7, Unit Test 2)
* **Quiz 5: jQuery/API search/autocomplete on the homepage**
  * Homepage View: [views/index.ejs](./views/index.ejs)
  * Homepage Frontend JS: [public/js/catalog.js](./public/js/catalog.js)
* **Quiz 7: Three (3) JS charts (Bar, Line, and Pie charts)**
  * Dashboard API Controller: [controllers/dashboardController.js](./controllers/dashboardController.js)
  * Admin Dashboard View: [views/admin/dashboard.ejs](./views/admin/dashboard.ejs)
  * Admin Dashboard Frontend JS: [public/js/admin/dashboard.js](./public/js/admin/dashboard.js)
* **Unit Test 2: jQuery infinite scroll (for the public catalog)**
  * Catalog View: [views/catalog.ejs](./views/catalog.ejs)
  * Catalog Frontend JS: [public/js/catalog.js](./public/js/catalog.js)

### 6. App Complexity & UI/UX Design (Unit Test 1, Unit 3)
* **Unit Test 1: UI/UX Design (Premium design system)**
  * Core CSS File: [public/css/style.css](./public/css/style.css)
* **Unit 3: App complexity and added features (e.g., Verified Customer Reviews, Profile Management, Head Admin security logic)**
  * Review Model: [models/Review.js](./models/Review.js)
  * Profile View: [views/profile.ejs](./views/profile.ejs)
  * Profile Frontend JS: [public/js/profile.js](./public/js/profile.js)
