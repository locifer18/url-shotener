import express from 'express';
import color from 'colors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import urlRoutes from './routers/urlRoutes.js';
import { redirectUrl } from './controllers/urlController.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

dotenv.config();

// Database config
connectDB();

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', urlRoutes);

// Redirect route (must be after API routes)
app.get('/:shortcode', redirectUrl);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgCyan.white);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`.bgMagenta.white);
});