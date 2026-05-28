require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

const app = express();

// ===== SECURITY MIDDLEWARE =====
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ===== BODY PARSERS =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== LOGGING =====
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ===== ROUTES =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/epin', require('./routes/ePinRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/withdrawals', require('./routes/withdrawalRoutes'));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/', (req, res) => res.json({ message: 'RS Trading API v1.0', status: 'running' }));

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== DATABASE & SERVER START =====
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 RS Trading API running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Mongoose strict mode for security
mongoose.set('strict', true);
mongoose.set('strictQuery', true);

startServer();

module.exports = app;
