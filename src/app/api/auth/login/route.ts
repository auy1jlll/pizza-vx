import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt for:', username);

    // Find user by email (case-insensitive)
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: username,
          mode: 'insensitive'
        }
      }
    });

    console.log('User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Check if password exists
    if (!user.password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Check role
    if (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 401 });
    }

    // Create JWT token with longer expiration using jose
    const token = await new jose.SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('pizza-builder-app')
      .setExpirationTime('72h') // 3 days for production stability
      .sign(JWT_SECRET);

    // Simple success response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set proper JWT token with consistent settings
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 72, // 72 hours to match JWT expiration
      secure: false, // Disabled for HTTP production deployment
      sameSite: 'strict',
      path: '/'
    });

    // Also set access-token for consistency
    response.cookies.set('access-token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 72, // 72 hours to match JWT expiration
      secure: false, // Disabled for HTTP production deployment
      sameSite: 'strict',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
