const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  brand: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  images: [{
    type: String
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    photo: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
