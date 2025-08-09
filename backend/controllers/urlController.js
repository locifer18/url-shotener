import shortid from 'shortid';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import Url from '../models/Url.js';

// Create short URL with advanced features
export const createShortUrl = async (req, res) => {
    console.log('Received request body:', req.body); // Debug log
    const { longUrl, customAlias, expiresIn, tags, password, createdBy } = req.body;

    try {
        // Validate URL
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlRegex.test(longUrl)) {
            return res.status(400).json({ message: 'Invalid URL format' });
        }

        // Check if custom alias is already taken
        if (customAlias) {
            const existingAlias = await Url.findOne({ customAlias });
            if (existingAlias) {
                return res.status(400).json({ message: 'Custom alias already taken' });
            }
        }

        // Check if the URL has already been shortened
        let url = await Url.findOne({ longUrl, createdBy: createdBy || 'anonymous' });
        if (url && !customAlias && !expiresIn && !password) {
            const shortUrl = customAlias || url.customAlias 
                ? `http://localhost:${process.env.PORT}/${customAlias || url.customAlias}`
                : `http://localhost:${process.env.PORT}/${url.shortCode}`;
            return res.json({ 
                shortUrl,
                qrCode: url.qrCode,
                analytics: {
                    clicks: url.clickCount,
                    created: url.createdAt
                }
            });
        }

        // Generate short code or use custom alias
        const shortCode = customAlias || shortid.generate();
        
        // Set expiration date
        let expiresAt = null;
        if (expiresIn) {
            const now = new Date();
            switch (expiresIn) {
                case '1h': expiresAt = new Date(now.getTime() + 60 * 60 * 1000); break;
                case '1d': expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); break;
                case '7d': expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); break;
                case '30d': expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); break;
            }
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Generate QR Code
        const shortUrl = `http://localhost:${process.env.PORT}/${shortCode}`;
        const qrCode = await QRCode.toDataURL(shortUrl);

        url = new Url({
            longUrl,
            shortCode,
            customAlias,
            expiresAt,
            qrCode,
            tags: tags || [],
            createdBy: createdBy || 'anonymous',
            password: hashedPassword
        });

        await url.save();
        
        res.json({ 
            shortUrl,
            qrCode,
            expiresAt,
            analytics: {
                clicks: 0,
                created: url.createdAt
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Redirect with advanced analytics
export const redirectUrl = async (req, res) => {
    try {
        const identifier = req.params.shortcode;
        const url = await Url.findOne({
            $or: [
                { shortCode: identifier },
                { customAlias: identifier }
            ],
            isActive: true
        });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }

        // Check if expired
        if (url.expiresAt && new Date() > url.expiresAt) {
            return res.status(410).json({ message: 'URL has expired' });
        }

        // Check password protection
        if (url.password) {
            const { password } = req.query;
            if (!password || !await bcrypt.compare(password, url.password)) {
                return res.status(401).json({ message: 'Password required' });
            }
        }

        // Collect analytics data
        const clickData = {
            timestamp: new Date(),
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer') || 'Direct'
        };

        // Update click count and analytics
        url.clickCount++;
        url.clicks.push(clickData);
        await url.save();

        return res.redirect(url.longUrl);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all URLs with advanced filtering
export const getAllUrls = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search, tag } = req.query;
        
        let query = {};
        if (search) {
            query.$or = [
                { longUrl: { $regex: search, $options: 'i' } },
                { shortCode: { $regex: search, $options: 'i' } },
                { customAlias: { $regex: search, $options: 'i' } }
            ];
        }
        if (tag) {
            query.tags = { $in: [tag] };
        }

        const urls = await Url.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-clicks -password');

        const total = await Url.countDocuments(query);
        
        res.json({
            urls,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get detailed analytics for a URL
export const getUrlAnalytics = async (req, res) => {
    try {
        const url = await Url.findOne({
            $or: [
                { shortCode: req.params.identifier },
                { customAlias: req.params.identifier }
            ]
        });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }

        // Process analytics data
        const analytics = {
            totalClicks: url.clickCount,
            uniqueClicks: new Set(url.clicks.map(click => click.ip)).size,
            clicksToday: url.clicks.filter(click => 
                new Date(click.timestamp).toDateString() === new Date().toDateString()
            ).length,
            clicksThisWeek: url.clicks.filter(click => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(click.timestamp) > weekAgo;
            }).length,
            topReferrers: getTopReferrers(url.clicks),
            clicksByDate: getClicksByDate(url.clicks),
            deviceStats: getDeviceStats(url.clicks)
        };

        res.json({
            url: {
                longUrl: url.longUrl,
                shortCode: url.shortCode,
                customAlias: url.customAlias,
                createdAt: url.createdAt,
                expiresAt: url.expiresAt,
                tags: url.tags,
                qrCode: url.qrCode
            },
            analytics
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Bulk operations
export const bulkCreateUrls = async (req, res) => {
    try {
        const { urls } = req.body;
        const results = [];

        for (const urlData of urls) {
            try {
                const shortCode = urlData.customAlias || shortid.generate();
                const shortUrl = `http://localhost:${process.env.PORT}/${shortCode}`;
                const qrCode = await QRCode.toDataURL(shortUrl);

                const url = new Url({
                    longUrl: urlData.longUrl,
                    shortCode,
                    customAlias: urlData.customAlias,
                    qrCode,
                    tags: urlData.tags || [],
                    createdBy: urlData.createdBy || 'bulk'
                });

                await url.save();
                results.push({ success: true, shortUrl, longUrl: urlData.longUrl });
            } catch (error) {
                results.push({ success: false, error: error.message, longUrl: urlData.longUrl });
            }
        }

        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper functions
function getTopReferrers(clicks) {
    const referrers = {};
    clicks.forEach(click => {
        const ref = click.referer || 'Direct';
        referrers[ref] = (referrers[ref] || 0) + 1;
    });
    return Object.entries(referrers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([referer, count]) => ({ referer, count }));
}

function getClicksByDate(clicks) {
    const dates = {};
    clicks.forEach(click => {
        const date = new Date(click.timestamp).toDateString();
        dates[date] = (dates[date] || 0) + 1;
    });
    return Object.entries(dates)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, count]) => ({ date, count }));
}

function getDeviceStats(clicks) {
    const devices = { mobile: 0, desktop: 0, tablet: 0, other: 0 };
    clicks.forEach(click => {
        const ua = click.userAgent?.toLowerCase() || '';
        if (ua.includes('mobile')) devices.mobile++;
        else if (ua.includes('tablet')) devices.tablet++;
        else if (ua.includes('mozilla')) devices.desktop++;
        else devices.other++;
    });
    return devices;
}