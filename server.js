require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const cartRoutes = require('./routes/cart');

const app = express();

// Middleware
const allowedOrigins = [
  'https://almadina-front.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked:', origin);
      callback(null, true); // Allow during debug or use a more permissive policy
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check & DB Wake-up endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    // Simple database operation to ensure activity
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({ 
      status: 'OK', 
      db: dbStatus,
      message: 'Almadina Store API is awake and healthy' 
    });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Almadina Store API is running' });
});

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cart', cartRoutes);

// Error handle
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export or listen
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;