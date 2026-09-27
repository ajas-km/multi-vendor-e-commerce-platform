const express = require('express');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('shared');
const {
  getAds, createAd, updateAd, deleteAd,
  getDiscounts, createDiscount, updateDiscount, deleteDiscount,
  getAllReviews, deleteReview,
  getDashboardStats
} = require('../controllers/adminController');

const router = express.Router();

// Multer config for ad image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// All admin routes are protected
router.use(authMiddleware.protect, authMiddleware.adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// Ads
router.route('/ads')
  .get(getAds)
  .post(upload.single('image'), createAd);

router.route('/ads/:id')
  .put(upload.single('image'), updateAd)
  .delete(deleteAd);

// Discounts
router.route('/discounts')
  .get(getDiscounts)
  .post(createDiscount);

router.route('/discounts/:id')
  .put(updateDiscount)
  .delete(deleteDiscount);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:productId/:reviewId', deleteReview);

module.exports = router;
