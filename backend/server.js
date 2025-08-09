import express from 'express';
import color from 'colors';
import dotenv from 'dotenv';
import urlRoutes from './routers/urlRoutes.js';
import { redirectUrl } from './controllers/urlController.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API routes
app.use('/api', urlRoutes);

// Redirect route (must be after API routes)
app.get('/:shortcode', redirectUrl);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgCyan.white);
});
