const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('shared');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/multi-vendor-ecommerce');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, console.log(`Order Service running on port ${PORT}`));
