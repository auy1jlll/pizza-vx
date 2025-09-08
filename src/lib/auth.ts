import * as jose from 'jose';
import { NextRequest } from 'next/server';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

// Cache for validated tokens to reduce JWT verification overhead
const tokenCache = new Map<string, { payload: JWTPayload; expiry: number }>();

export async function verifyAdminToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Check for access-token first (new JWT system)
    let token = request.cookies.get('access-token')?.value;
    
    // Fallback to admin-token for backward compatibility
    if (!token) {
      token = request.cookies.get('admin-token')?.value;
    }
    
    if (!token) {
      return null;
    }

    // Check cache first for performance
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      return cached.payload;
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'pizza-builder-app',
    });

    const decoded = payload as unknown as JWTPayload;

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

export async function requireAdmin(request: NextRequest) {
  const user = await verifyAdminToken(request);
  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}

// Management portal token verification - allows ADMIN and EMPLOYEE roles
export async function verifyManagementToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Check for access-token first (new JWT system)
    let token = request.cookies.get('access-token')?.value;
    
    // Fallback to admin-token for backward compatibility
    if (!token) {
      token = request.cookies.get('admin-token')?.value;
    }
    
    if (!token) {
      return null;
    }

    // Check cache first for performance
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      // Allow both ADMIN and EMPLOYEE roles for management portal
      if (cached.payload.role === 'ADMIN' || cached.payload.role === 'EMPLOYEE') {
        return cached.payload;
      }
      return null;
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'pizza-builder-app',
    });

    const decoded = payload as unknown as JWTPayload;

    // Allow both ADMIN and EMPLOYEE roles for management portal
    if (decoded.role !== 'ADMIN' && decoded.role !== 'EMPLOYEE') {
      return null;
    }

    // Cache the validated token for 5 minutes
    tokenCache.set(token, {
      payload: decoded,
      expiry: Date.now() + (5 * 60 * 1000)
    });

    return decoded;
  } catch (error) {
    console.error('Management token verification error:', error);
    return null;
  }
}

// General token verification - allows any authenticated user
export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Check for access-token first (new JWT system)
    let token = request.cookies.get('access-token')?.value;
    
    // Fallback to admin-token for backward compatibility
    if (!token) {
      token = request.cookies.get('admin-token')?.value;
    }
    
    if (!token) {
      return null;
    }

    // Check cache first for performance
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      return cached.payload;
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'pizza-builder-app',
    });

    const decoded = payload as unknown as JWTPayload;

    // Cache the validated token for 5 minutes
    tokenCache.set(token, {
      payload: decoded,
      expiry: Date.now() + (5 * 60 * 1000)
    });

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Kitchen staff authentication - allows both ADMIN and EMPLOYEE roles
export async function verifyKitchenStaffToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Check for access-token first (new JWT system)
    let token = request.cookies.get('access-token')?.value;
    
    // Fallback to admin-token for backward compatibility
    if (!token) {
      token = request.cookies.get('admin-token')?.value;
    }
    
    if (!token) {
      return null;
    }

    // Check cache first for performance
    const cached = tokenCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      // Allow both ADMIN and EMPLOYEE roles for kitchen access
      if (cached.payload.role === 'ADMIN' || cached.payload.role === 'EMPLOYEE') {
        return cached.payload;
      }
      return null;
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'pizza-builder-app',
    });

    const decoded = payload as unknown as JWTPayload;

    // Allow both ADMIN and EMPLOYEE roles for kitchen access
    if (decoded.role !== 'ADMIN' && decoded.role !== 'EMPLOYEE') {
      return null;
    }

    // Cache the validated token for 5 minutes
    tokenCache.set(token, {
      payload: decoded,
      expiry: Date.now() + (5 * 60 * 1000)
    });

    return decoded;
  } catch (error) {
    console.error('Kitchen staff token verification error:', error);
    return null;
  }
}
