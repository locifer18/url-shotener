# 🔗 Advanced MERN Stack URL Shortener

A production-ready, feature-rich URL shortener application built with MongoDB, Express.js, React, and Node.js. This project showcases advanced web development skills with enterprise-level features.

## 🚀 Features

### Core Features
- ✅ **URL Shortening** - Convert long URLs to short, shareable links
- ✅ **Custom Aliases** - Create memorable custom short links
- ✅ **QR Code Generation** - Automatic QR codes for mobile sharing
- ✅ **Click Tracking** - Detailed analytics and click counting
- ✅ **Bulk Processing** - Upload and process multiple URLs at once

### Advanced Features
- 🔒 **Password Protection** - Secure links with password authentication
- ⏰ **Link Expiration** - Set automatic expiration dates
- 🏷️ **Tagging System** - Organize links with custom tags
- 📊 **Advanced Analytics** - Device stats, referrers, geographic data
- 🛡️ **Rate Limiting** - Prevent abuse with intelligent rate limiting
- 🔐 **Security Headers** - Production-ready security with Helmet.js
- 📱 **Responsive Design** - Mobile-first Bootstrap interface
- 🐳 **Docker Support** - Containerized deployment ready

### Admin Features
- 📈 **Admin Dashboard** - Comprehensive URL management
- 🔍 **Search & Filter** - Find URLs by content, tags, or dates
- 📄 **Pagination** - Handle large datasets efficiently
- 📊 **Real-time Analytics** - Live click tracking and statistics
- 📥 **CSV Export** - Export bulk operation results

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Hooks
- React Router DOM for navigation
- Axios for API communication
- Bootstrap 5 for responsive UI
- Custom components architecture

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication (ready)
- bcryptjs for password hashing
- QRCode generation library
- Express Rate Limit
- Helmet.js for security
- Express Validator

**DevOps & Deployment:**
- Docker & Docker Compose
- Nginx for frontend serving
- Health checks and monitoring
- Production-ready configurations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Docker (optional, for containerized deployment)
- Git

## 🚀 Quick Start

### Method 1: Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
PORT=8080
NODE_ENV=development
```

4. **Start Backend Server**
```bash
npm run dev
```

5. **Frontend Setup** (New terminal)
```bash
cd url-shortener-frontend
npm install
npm start
```

### Method 2: Docker Deployment

1. **Clone and navigate**
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- MongoDB: localhost:27017

## 📖 API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints
- `POST /api/shorten` - Create shortened URL
- `POST /api/bulk-shorten` - Bulk URL processing
- `GET /api/admin/urls` - Admin URL management
- `GET /api/analytics/:id` - Detailed analytics
- `GET /:shortcode` - Redirect to original URL

## 🏗️ Project Structure

```
url-shortener/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   └── urlController.js      # Business logic
│   ├── middleware/
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   └── Url.js               # MongoDB schema
│   ├── routers/
│   │   └── urlRoutes.js         # API routes
│   ├── .env                     # Environment variables
│   ├── Dockerfile               # Backend container
│   ├── healthcheck.js           # Health monitoring
│   ├── package.json
│   └── server.js                # Express server
├── url-shortener-frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdvancedForm.js  # URL creation form
│   │   │   ├── Analytics.js     # Analytics dashboard
│   │   │   ├── BulkUpload.js    # Bulk processing
│   │   │   └── QRCodeDisplay.js # QR code component
│   │   ├── Admin.js             # Admin panel
│   │   ├── App.js               # Main application
│   │   └── index.js             # React entry point
│   ├── Dockerfile               # Frontend container
│   ├── nginx.conf               # Nginx configuration
│   └── package.json
├── docker-compose.yml           # Container orchestration
├── API_DOCUMENTATION.md         # API reference
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
NODE_ENV=production
```

### Rate Limiting Configuration
- URL Shortening: 10 requests per 15 minutes
- Bulk Operations: 3 requests per hour
- General API: 100 requests per 15 minutes

## 📊 Features Showcase

### 1. Advanced URL Creation
- Custom aliases with validation
- Password protection
- Expiration dates (1h, 1d, 7d, 30d)
- Tag organization
- QR code generation

### 2. Comprehensive Analytics
- Total and unique click tracking
- Device type statistics
- Referrer analysis
- Geographic data (ready for implementation)
- Time-based click charts

### 3. Admin Dashboard
- Sortable and searchable URL list
- Pagination for large datasets
- Real-time analytics integration
- Bulk operation management
- CSV export functionality

### 4. Security Features
- Rate limiting per IP
- Input validation and sanitization
- Security headers with Helmet.js
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention

## 🚀 Deployment
2. **Deploy**

### Cloud Deployment Options
- **Netlify**: Frontend deployment
- **Render**: Full-stack deployment

## 🧪 Testing

### Manual Testing Checklist
- [ ] URL shortening with various formats
- [ ] Custom alias creation and validation
- [ ] Password protection functionality
- [ ] Expiration date handling
- [ ] Bulk upload processing
- [ ] Analytics data accuracy
- [ ] Rate limiting enforcement
- [ ] Mobile responsiveness

### API Testing with curl
```bash
# Create short URL
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com"}'

# Get analytics
curl http://localhost:8080/api/analytics/abc123
```
