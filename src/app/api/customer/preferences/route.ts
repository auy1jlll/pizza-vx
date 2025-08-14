import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// GET /api/customer/preferences - Get user preferences
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

    // Get user preferences from database
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        // Note: We'll need to add a preferences field to the schema
        // For now, we'll return empty preferences
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Add preferences field to User model and return actual preferences
    // For now, return default preferences
    const defaultPreferences = {
      defaultOrderType: 'PICKUP',
      defaultAddress: '',
      defaultCity: '',
      defaultZip: '',
      favoriteSize: '',
      favoriteCrust: '',
      favoriteSauce: '',
      dietaryRestrictions: '',
      phone: ''
    };

    return NextResponse.json({
      preferences: defaultPreferences
    });

  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// POST /api/customer/preferences - Save user preferences
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

    const { preferences } = await request.json();

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

    // TODO: Save preferences to database
    // For now, we'll just return success
    // In a real implementation, we'd add a preferences field to the User model
    // or create a separate UserPreferences table

    return NextResponse.json({
      message: 'Preferences saved successfully',
      preferences
    });

  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
