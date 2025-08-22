import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: {
        customerProfile: true,
        employeeProfile: true,
        customerAddresses: {
          where: { isActive: true },
          orderBy: { isDefault: 'desc' }
        },
        customerFavorites: {
          orderBy: { lastOrdered: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        customerProfile: user.customerProfile,
        employeeProfile: user.employeeProfile,
        addresses: user.customerAddresses,
        favorites: user.customerFavorites
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { user: userData, profile: profileData } = data;

    // Update basic user information
    await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        name: userData.name,
        phone: userData.phone,
        ...(userData.email && { email: userData.email })
      }
    });

    // Update or create customer profile
    if (profileData && tokenData.role === 'CUSTOMER') {
      await prisma.customerProfile.upsert({
        where: { userId: tokenData.userId },
        update: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
          phone: profileData.phone,
          dietaryPreferences: profileData.dietaryPreferences || [],
          favoritePizzaSizeId: profileData.favoritePizzaSizeId,
          favoriteCrustId: profileData.favoriteCrustId,
          defaultOrderType: profileData.defaultOrderType || 'PICKUP',
          marketingOptIn: profileData.marketingOptIn || false,
          notes: profileData.notes
        },
        create: {
          userId: tokenData.userId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
          phone: profileData.phone,
          dietaryPreferences: profileData.dietaryPreferences || [],
          favoritePizzaSizeId: profileData.favoritePizzaSizeId,
          favoriteCrustId: profileData.favoriteCrustId,
          defaultOrderType: profileData.defaultOrderType || 'PICKUP',
          marketingOptIn: profileData.marketingOptIn || false,
          notes: profileData.notes
        }
      });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
