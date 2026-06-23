const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { verifyToken } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.put('/profile', verifyToken, upload.single('profilePicture'), userController.updateProfile);

module.exports = router;
