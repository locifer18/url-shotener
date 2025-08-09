import { body, validationResult } from 'express-validator';

export const validateUrl = [
  body('longUrl')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL with http:// or https://'),
  
  body('customAlias')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 50 })
    .withMessage('Custom alias must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Custom alias can only contain letters, numbers, hyphens, and underscores'),
  
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  
  body('tags')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('createdBy')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('Created by field must be less than 100 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateBulkUrls = [
  body('urls')
    .isArray({ min: 1, max: 100 })
    .withMessage('URLs array must contain between 1 and 100 items'),
  
  body('urls.*.longUrl')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Each URL must be valid with http:// or https://'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];