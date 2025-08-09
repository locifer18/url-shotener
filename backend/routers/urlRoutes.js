import express from 'express';
import { 
    createShortUrl, 
    getAllUrls, 
    getUrlAnalytics, 
    bulkCreateUrls 
} from '../controllers/urlController.js';
import { shortenLimiter, bulkLimiter } from '../middleware/rateLimiter.js';
import { validateUrl, validateBulkUrls } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/shorten
// @desc    Create a short URL with advanced features
router.post('/shorten', shortenLimiter, validateUrl, createShortUrl);

// @route   POST /api/bulk-shorten
// @desc    Create multiple short URLs at once
router.post('/bulk-shorten', bulkLimiter, validateBulkUrls, bulkCreateUrls);

// @route   GET /api/admin/urls
// @desc    Get all URLs with pagination and filtering
router.get('/admin/urls', getAllUrls);

// @route   GET /api/analytics/:identifier
// @desc    Get detailed analytics for a specific URL
router.get('/analytics/:identifier', getUrlAnalytics);

export default router;