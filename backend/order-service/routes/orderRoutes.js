const express = require('express');
const { createOrder, getMyOrders, getVendorOrders, updateOrderStatus } = require('../controllers/orderController');
const { authMiddleware } = require('shared');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);

// Vendor specific routes
router.get('/vendor', authMiddleware.vendorOnly, getVendorOrders);
router.put('/:id/status', authMiddleware.vendorOnly, updateOrderStatus);

module.exports = router;
