const express = require('express');
const { getCart, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart } = require('../controllers/cartController');
const { authMiddleware } = require('shared');

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware.protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItemToCart);
router.route('/items/:productId')
  .put(updateItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
