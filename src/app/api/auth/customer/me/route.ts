import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check for customer token
    const token = request.cookies.get('user-token')?.value;

    // If no token, return null user (allow public browsing)
    if (!token) {
      return NextResponse.json({
        user: null
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    // Get customer from database (only customers)
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'CUSTOMER' // Only allow customers
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // If user not found or not a customer, return null user
    if (!user) {
      return NextResponse.json({
        user: null
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Customer auth verification error:', error);
    // Return null user instead of error to allow public browsing
    return NextResponse.json({
      user: null
    });
  }
}
