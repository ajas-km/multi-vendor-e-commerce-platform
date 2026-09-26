const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('shared');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/multi-vendor-ecommerce');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, console.log(`Product Service running on port ${PORT}`));
