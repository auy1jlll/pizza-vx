import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyAdminToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JWTPayload;

    if (decoded.role !== 'ADMIN') {
      return null;
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
