const express = require('express');
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { authMiddleware } = require('shared');

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

router.route('/')
  .get(getProducts)
  .post(authMiddleware.protect, authMiddleware.vendorOnly, upload.array('images', 5), createProduct);

router.get('/:id', getProductById);

module.exports = router;
