const express = require('express');
const { getVendorProfile, updateVendorProfile, getDashboardStats } = require('../controllers/vendorController');
const { authMiddleware } = require('shared');
const { protect, vendorOnly } = authMiddleware;

const router = express.Router();

router.get('/me', protect, vendorOnly, getVendorProfile);
router.post('/profile', protect, vendorOnly, updateVendorProfile);
router.get('/dashboard', protect, vendorOnly, getDashboardStats);

module.exports = router;
