import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      country,
      deliveryInstructions,
      isDefault
    } = data;

    // Verify user owns this address
    const existingAddress = await prisma.customerAddress.findFirst({
      where: {
        id: params.id,
        userId: tokenData.userId
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { 
          userId: tokenData.userId,
          isDefault: true,
          id: { not: params.id }
        },
        data: { isDefault: false }
      });
    }

    const address = await prisma.customerAddress.update({
      where: { id: params.id },
      data: {
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
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns this address
    const existingAddress = await prisma.customerAddress.findFirst({
      where: {
        id: params.id,
        userId: tokenData.userId
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    await prisma.customerAddress.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Address deleted successfully' });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
