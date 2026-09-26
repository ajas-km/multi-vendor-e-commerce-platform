const { Vendor, Product, Order } = require('shared');

// @desc    Get vendor profile
// @route   GET /api/vendors/me
// @access  Private/Vendor
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update vendor profile
// @route   POST /api/vendors/profile
// @access  Private/Vendor
const updateVendorProfile = async (req, res) => {
  try {
    const { storeName, description, logoUrl } = req.body;

    let vendor = await Vendor.findOne({ userId: req.user._id });

    if (vendor) {
      vendor.storeName = storeName || vendor.storeName;
      vendor.description = description || vendor.description;
      vendor.logoUrl = logoUrl || vendor.logoUrl;
      const updatedVendor = await vendor.save();
      return res.json(updatedVendor);
    } else {
      vendor = await Vendor.create({
        userId: req.user._id,
        storeName,
        description,
        logoUrl
      });
      return res.status(201).json(vendor);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/dashboard
// @access  Private/Vendor
const getDashboardStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    // Get total products
    const productCount = await Product.countDocuments({ vendorId: vendor._id });

    // Get total orders and revenue
    // In our Order schema, vendorOrders contains the vendor specific order slice
    const orders = await Order.find({ 'vendorOrders.vendorId': vendor._id });
    
    let totalRevenue = 0;
    let totalOrders = 0;

    orders.forEach(order => {
      const vendorSlice = order.vendorOrders.find(vo => vo.vendorId.toString() === vendor._id.toString());
      if (vendorSlice) {
        totalOrders++;
        totalRevenue += vendorSlice.subtotal;
      }
    });

    res.json({
      productCount,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getDashboardStats
};
