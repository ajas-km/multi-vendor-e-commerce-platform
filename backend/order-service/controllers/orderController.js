const { Order, Cart, Product, Vendor } = require('shared');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.vendorId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No cart items to order' });
    }

    // Split cart items by vendor for Multi-Vendor tracking
    const vendorSlicesMap = new Map();
    let totalAmount = 0;

    for (const item of cart.items) {
      const vendorId = item.vendorId._id.toString();
      const itemSubtotal = item.price * item.quantity;
      
      if (!vendorSlicesMap.has(vendorId)) {
        vendorSlicesMap.set(vendorId, {
          vendorId: item.vendorId._id,
          items: [],
          status: 'Pending',
          subtotal: 0
        });
      }
      
      const slice = vendorSlicesMap.get(vendorId);
      slice.items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
      slice.subtotal += itemSubtotal;
      totalAmount += itemSubtotal;

      // Update product stock
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const vendorOrders = Array.from(vendorSlicesMap.values());

    const order = new Order({
      userId: req.user._id,
      vendorOrders,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: 'Pending', // Assuming simple payment flow for now
      overallStatus: 'Pending'
    });

    const createdOrder = await order.save();

    // Clear the cart
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('vendorOrders.items.productId', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for a specific vendor
// @route   GET /api/orders/vendor
// @access  Private/Vendor
const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const orders = await Order.find({ 'vendorOrders.vendorId': vendor._id })
      .populate('userId', 'name email')
      .populate('vendorOrders.items.productId', 'name images')
      .sort({ createdAt: -1 });
    
    // We only want to return the slices of the order that belong to this vendor
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.vendorOrders = orderObj.vendorOrders.filter(vo => vo.vendorId.toString() === vendor._id.toString());
      return orderObj;
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status for a vendor's slice
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const vendorSlice = order.vendorOrders.find(vo => vo.vendorId.toString() === vendor._id.toString());
    
    if (vendorSlice) {
      vendorSlice.status = status;
      
      // Update overall status if all slices are delivered
      const allDelivered = order.vendorOrders.every(vo => vo.status === 'Delivered');
      if (allDelivered) order.overallStatus = 'Delivered';
      
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Vendor order slice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus
};
