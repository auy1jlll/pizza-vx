import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
// Replaced express-rate-limit with lightweight in-memory limiter
import { authLimiter } from '@/lib/simple-rate-limit';
import { BruteForceProtectionService } from '@/lib/brute-force-protection';
import { JWTService } from '@/lib/jwt-service';
import { z } from 'zod';

const bruteForceProtection = new BruteForceProtectionService();
const jwtService = new JWTService();

const loginSchema = z.object({
  username: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function POST(request: NextRequest) {
  // Apply lightweight auth rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = authLimiter.check('auth-login', ip);
  if (!limit.allowed) {
    return NextResponse.json({
      error: 'Too many login attempts. Please wait before retrying.',
      retryAfterSeconds: Math.ceil((limit.resetAt - Date.now()) / 1000)
    }, { status: 429, headers: { 'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString() } });
  }

  // Get client info for brute force protection
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", issues: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { username, password } = validation.data;

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
        expiresIn: '60m',
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
      maxAge: 60 * 60 // 1 hour
    });

    // Also set admin-token for backward compatibility
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 // 1 hour
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
