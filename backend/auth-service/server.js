const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require('shared');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

// Connect to database
// Defaulting to a local MongoDB for development if env is missing
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/multi-vendor-ecommerce');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Mount routers
app.use('/api/auth', authRoutes);

// Base route
app.get('/', (req, res) => res.send('Auth Service Running'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Auth Service running on port ${PORT}`));
