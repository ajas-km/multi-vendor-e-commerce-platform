const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('shared');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/multi-vendor-ecommerce');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, console.log(`Cart Service running on port ${PORT}`));
