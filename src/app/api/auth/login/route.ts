import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authRateLimit } from '@/lib/rate-limit';
import { BruteForceProtectionService } from '@/lib/brute-force-protection';
import { JWTService } from '@/lib/jwt-service';

const prisma = new PrismaClient();
const bruteForceProtection = new BruteForceProtectionService();
const jwtService = new JWTService();

export async function POST(request: NextRequest) {
  // Apply rate limiting for authentication
  const rateLimitResult = await new Promise((resolve) => {
    authRateLimit(request as any, {
      status: (code: number) => ({
        json: (data: any) => resolve({ error: true, status: code, data })
      })
    } as any, () => resolve({ error: false }));
  });

  if ((rateLimitResult as any).error) {
    return NextResponse.json(
      (rateLimitResult as any).data,
      { status: (rateLimitResult as any).status }
    );
  }

  // Get client info for brute force protection
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // TEMPORARILY DISABLED: Check if IP/email is locked out
    // const lockoutStatus = await bruteForceProtection.isLockedOut(clientIP, username);
    // if (lockoutStatus.locked) {
    //   await bruteForceProtection.logSecurityEvent({
    //     eventType: 'FAILED_LOGIN',
    //     ipAddress: clientIP,
    //     email: username,
    //     details: `Login attempt during lockout period. Unlock at: ${lockoutStatus.unlockAt}`,
    //     severity: 'MEDIUM'
    //   });

    //   return NextResponse.json(
    //     { 
    //       error: 'Account temporarily locked',
    //       message: lockoutStatus.reason,
    //       unlockAt: lockoutStatus.unlockAt
    //     },
    //     { status: 429 }
    //   );
    // }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { email: username } // Using email as username
    });

    // Verify password
    let isPasswordValid = false;
    if (user && user.password && user.role === 'ADMIN') {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    // TEMPORARILY DISABLED: Record login attempt (success or failure)
    // await bruteForceProtection.recordLoginAttempt({
    //   ipAddress: clientIP,
    //   email: username,
    //   success: isPasswordValid && user !== null,
    //   userAgent,
    // });

    if (!user || user.role !== 'ADMIN' || !isPasswordValid) {
      // TEMPORARILY DISABLED: Log failed login attempt
      // await bruteForceProtection.logSecurityEvent({
      //   eventType: 'FAILED_LOGIN',
      //   ipAddress: clientIP,
      //   email: username,
      //   details: JSON.stringify({
      //     reason: !user ? 'USER_NOT_FOUND' : 
      //             user.role !== 'ADMIN' ? 'INSUFFICIENT_PERMISSIONS' : 
      //             'INVALID_PASSWORD',
      //     userAgent
      //   }),
      //   severity: 'MEDIUM'
      // });

      return NextResponse.json(
        { error: 'Invalid credentials or insufficient permissions' },
        { status: 401 }
      );
    }

    // Generate simple JWT token (matching auth middleware)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { 
        expiresIn: '24h',
        issuer: 'pizza-builder-app'
      }
    );

    // Set simple admin-token cookie for immediate compatibility
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set the token cookie that auth middleware expects
    response.cookies.set('access-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    // Also set admin-token for backward compatibility
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
