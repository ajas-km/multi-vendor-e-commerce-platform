const connectDB = require('./config/db');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Ad = require('./models/Ad');
const Discount = require('./models/Discount');
const authMiddleware = require('./middleware/authMiddleware');

module.exports = {
  connectDB,
  User,
  Vendor,
  Product,
  Cart,
  Order,
  Ad,
  Discount,
  authMiddleware
};
