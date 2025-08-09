import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  referer: String,
  country: String,
  city: String
});

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  clicks: [clickSchema],
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrCode: String,
  tags: [String],
  createdBy: String,
  password: String
}, {
  timestamps: true
});

// Index for expiration
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('url', urlSchema);