const { Ad, Discount, Product } = require('shared');

// ==================== ADS ====================

// @desc    Get all ads
// @route   GET /api/admin/ads
// @access  Private/Admin
const getAds = async (req, res) => {
  try {
    const ads = await Ad.find({}).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an ad
// @route   POST /api/admin/ads
// @access  Private/Admin
const createAd = async (req, res) => {
  try {
    const { title, linkUrl, placement, isActive, startDate, endDate } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5003/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const ad = await Ad.create({
      title,
      imageUrl,
      linkUrl,
      placement,
      isActive: isActive !== undefined ? isActive : true,
      startDate,
      endDate
    });
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an ad
// @route   PUT /api/admin/ads/:id
// @access  Private/Admin
const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    const { title, linkUrl, placement, isActive, startDate, endDate } = req.body;
    if (title !== undefined) ad.title = title;
    if (linkUrl !== undefined) ad.linkUrl = linkUrl;
    if (placement !== undefined) ad.placement = placement;
    if (isActive !== undefined) ad.isActive = isActive;
    if (startDate !== undefined) ad.startDate = startDate;
    if (endDate !== undefined) ad.endDate = endDate;

    if (req.file) {
      ad.imageUrl = `http://localhost:5003/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      ad.imageUrl = req.body.imageUrl;
    }

    const updated = await ad.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an ad
// @route   DELETE /api/admin/ads/:id
// @access  Private/Admin
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });
    res.json({ message: 'Ad removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DISCOUNTS ====================

// @desc    Get all discounts
// @route   GET /api/admin/discounts
// @access  Private/Admin
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({}).sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a discount
// @route   POST /api/admin/discounts
// @access  Private/Admin
const createDiscount = async (req, res) => {
  try {
    const { code, description, type, value, minOrderAmount, maxUses, isActive, expiresAt } = req.body;
    const discount = await Discount.create({
      code, description, type, value, minOrderAmount, maxUses, isActive, expiresAt
    });
    res.status(201).json(discount);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a discount
// @route   PUT /api/admin/discounts/:id
// @access  Private/Admin
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });

    Object.assign(discount, req.body);
    const updated = await discount.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a discount
// @route   DELETE /api/admin/discounts/:id
// @access  Private/Admin
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    res.json({ message: 'Discount removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== REVIEWS ====================

// @desc    Get all reviews across all products
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .select('name images reviews')
      .sort({ updatedAt: -1 });

    const allReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          productImage: product.images?.[0] || '',
          userName: review.name,
          rating: review.rating,
          comment: review.comment,
          photo: review.photo,
          createdAt: review.createdAt
        });
      });
    });

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:productId/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews = product.reviews.filter(
      r => r._id.toString() !== req.params.reviewId
    );

    // Recalculate ratings
    if (product.reviews.length > 0) {
      product.ratings.count = product.reviews.length;
      product.ratings.average =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.ratings.count = 0;
      product.ratings.average = 0;
    }

    await product.save();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DASHBOARD ====================

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const { User, Vendor, Order } = require('shared');
    
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeAds = await Ad.countDocuments({ isActive: true });
    const activeDiscounts = await Discount.countDocuments({ isActive: true });

    // Reviews count
    const productsWithReviews = await Product.aggregate([
      { $unwind: '$reviews' },
      { $count: 'total' }
    ]);
    const totalReviews = productsWithReviews[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

    res.json({
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      activeAds,
      activeDiscounts,
      totalReviews,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAds, createAd, updateAd, deleteAd,
  getDiscounts, createDiscount, updateDiscount, deleteDiscount,
  getAllReviews, deleteReview,
  getDashboardStats
};
