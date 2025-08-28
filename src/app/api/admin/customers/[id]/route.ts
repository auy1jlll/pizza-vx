import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        isActive: data.isActive,
      },
    });

    // Update customer profile if it exists
    if (data.firstName || data.lastName) {
      await prisma.customerProfile.upsert({
        where: { userId: id },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        create: {
          userId: id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
        },
      });
    }

    return NextResponse.json({ 
      message: 'Customer updated successfully',
      customer: updatedUser 
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete customer profile first (if exists)
    await prisma.customerProfile.deleteMany({
      where: { userId: id },
    });

    // Delete related orders
    await prisma.order.deleteMany({
      where: { userId: id },
    });

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Customer deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
