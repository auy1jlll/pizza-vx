import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// GET /api/customer/favorites - Get user's favorite pizzas
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    // Get user
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'CUSTOMER'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Implement favorites table and return actual favorites
    // For now, return empty array
    const favorites: any[] = [];

    return NextResponse.json({
      favorites
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/customer/favorites - Add a pizza to favorites
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('user-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    const { pizza } = await request.json();

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'CUSTOMER'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Save favorite pizza to database
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Pizza added to favorites',
      favorite: pizza
    });

  } catch (error) {
    console.error('Error saving favorite:', error);
    return NextResponse.json(
      { error: 'Failed to save favorite' },
      { status: 500 }
    );
  }
}
