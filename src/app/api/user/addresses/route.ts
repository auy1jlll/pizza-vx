import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Get user addresses
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { 
        userId: tokenData.userId,
        isActive: true 
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ addresses });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new address
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      label,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country = 'US',
      deliveryInstructions,
      isDefault = false
    } = data;

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { 
          userId: tokenData.userId,
          isDefault: true 
        },
        data: { isDefault: false }
      });
    }

    const address = await prisma.customerAddress.create({
      data: {
        userId: tokenData.userId,
        label,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        deliveryInstructions,
        isDefault
      }
    });

    return NextResponse.json({ address });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
