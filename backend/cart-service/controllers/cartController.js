const { Cart, Product } = require('shared');

// Helper to calculate total
const calculateSubtotal = (items) => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name images stock')
      .populate('items.vendorId', 'storeName');

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [], subtotal: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [], subtotal: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Item exists, update quantity
      let newQuantity = cart.items[itemIndex].quantity + Number(quantity);
      if (newQuantity > product.stock) {
        newQuantity = product.stock;
      }
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].price = product.price; // Update to latest price just in case
    } else {
      // Item does not exist, add it
      cart.items.push({
        productId: product._id,
        vendorId: product.vendorId,
        quantity: Number(quantity),
        price: product.price
      });
    }

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name images stock')
      .populate('items.vendorId', 'storeName');

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      const product = await Product.findById(productId);
      
      let newQuantity = Number(quantity);
      if (newQuantity > product.stock) {
        newQuantity = product.stock;
      } else if (newQuantity < 1) {
        newQuantity = 1;
      }
      
      cart.items[itemIndex].quantity = newQuantity;
      cart.subtotal = calculateSubtotal(cart.items);
      await cart.save();
      
      const updatedCart = await Cart.findById(cart._id)
        .populate('items.productId', 'name images stock')
        .populate('items.vendorId', 'storeName');
        
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.subtotal = calculateSubtotal(cart.items);
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name images stock')
      .populate('items.vendorId', 'storeName');
      
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.subtotal = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
};
