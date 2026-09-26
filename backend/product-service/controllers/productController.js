const { Product, Vendor } = require('shared');

// @desc    Fetch all products with filtering, search, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };

    const query = { ...keyword, ...category, ...priceFilter, isActive: true };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('vendorId', 'storeName logoUrl userId')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sort === 'price-low-high' ? { price: 1 } : req.query.sort === 'price-high-low' ? { price: -1 } : { createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'storeName description logoUrl userId');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found. Please set up your store first.' });

    const { name, description, price, category, stock } = req.body;

    // Build image URLs from uploaded files
    const images = req.files && req.files.length > 0
      ? req.files.map(file => `http://localhost:5003/uploads/${file.filename}`)
      : [];

    const product = new Product({
      vendorId: vendor._id,
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      images
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
