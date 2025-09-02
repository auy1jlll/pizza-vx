// Rate Limiting Middleware for Security Enhancement
import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    console.log(`[SECURITY] Rate limit exceeded for auth endpoint. IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Authentication rate limit exceeded',
      message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for file upload endpoints
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    error: 'Too many file uploads from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[SECURITY] Upload rate limit exceeded. IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Upload rate limit exceeded',
      message: 'Too many file uploads from this IP. Please try again in 1 hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for order creation (prevent spam orders)
export const orderRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 orders per 5 minutes
  message: {
    error: 'Too many orders from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[SECURITY] Order rate limit exceeded. IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Order rate limit exceeded',
      message: 'Too many orders placed from this IP. Please try again in 5 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for admin endpoints
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 admin requests per windowMs
  message: {
    error: 'Too many admin requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[SECURITY] Admin rate limit exceeded. IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      error: 'Admin rate limit exceeded',
      message: 'Too many admin requests from this IP. Please try again in 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Create a middleware that applies different rate limits based on the endpoint
export function createRateLimitMiddleware(req: any, res: any, next: any) {
  const path = req.url;
  
  // Apply specific rate limits based on endpoint
  if (path.includes('/api/auth/login') || path.includes('/api/auth/register')) {
    return authRateLimit(req, res, next);
  }
  
  if (path.includes('/api/upload') || path.includes('/api/management-portal/upload')) {
    return uploadRateLimit(req, res, next);
  }
  
  if (path.includes('/api/checkout') || path.includes('/api/orders')) {
    return orderRateLimit(req, res, next);
  }
  
  if (path.includes('/api/admin/')) {
    return adminRateLimit(req, res, next);
  }
  
  // Default general rate limiting for all other API endpoints
  if (path.startsWith('/api/')) {
    return generalRateLimit(req, res, next);
  }
  
  // No rate limiting for non-API routes
  next();
}
