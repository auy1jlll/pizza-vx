import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Cache for validated tokens to reduce JWT verification overhead
const tokenCache = new Map<string, { payload: JWTPayload; expiry: number }>();

export function verifyAdminToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }

    // Check cache first for performance
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      return cached.payload;
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JWTPayload;

    if (decoded.role !== 'ADMIN') {
      return null;
    }

    // Cache the validated token for 5 minutes
    tokenCache.set(token, {
      payload: decoded,
      expiry: Date.now() + (5 * 60 * 1000)
    });

    // Clean up expired cache entries periodically
    if (tokenCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (value.expiry <= now) {
          tokenCache.delete(key);
        }
      }
    }

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function requireAdmin(request: NextRequest) {
  const user = verifyAdminToken(request);
  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}
