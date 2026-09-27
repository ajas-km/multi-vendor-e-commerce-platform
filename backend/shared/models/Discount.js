const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Discount code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required']
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    default: 0 // 0 = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
