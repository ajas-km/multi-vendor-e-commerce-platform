const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require('shared');
const vendorRoutes = require('./routes/vendorRoutes');

dotenv.config();
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/multi-vendor-ecommerce');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use('/api/vendors', vendorRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, console.log(`Vendor Service running on port ${PORT}`));
