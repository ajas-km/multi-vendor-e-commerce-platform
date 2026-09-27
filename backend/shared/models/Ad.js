const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ad title is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Ad image URL is required']
  },
  linkUrl: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    enum: ['hero', 'sidebar', 'banner'],
    default: 'hero'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
