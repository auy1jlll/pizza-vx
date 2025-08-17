import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/admin/sizes/[id] - Update size
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, diameter } = await request.json();
    
    // Validate required fields
    if (!name || !diameter) {
      return NextResponse.json(
        { error: 'Name and diameter are required' },
        { status: 400 }
      );
    }

    const size = await prisma.pizzaSize.update({
      where: { id },
      data: {
        name,
        diameter
      }
    });
    
    return NextResponse.json(size);
  } catch (error) {
    console.error('Error updating size:', error);
    return NextResponse.json({ error: 'Failed to update size' }, { status: 500 });
  }
}

// DELETE /api/admin/sizes/[id] - Delete size
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if there are order items using this size
    const orderItemsCount = await prisma.orderItem.count({
      where: { pizzaSizeId: id }
    });

    if (orderItemsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete size. It is being used in ${orderItemsCount} order item(s). Please deactivate it instead.` 
      }, { status: 400 });
    }

    // Check if there are specialty pizza sizes using this size
    const specialtyCount = await prisma.specialtyPizzaSize.count({
      where: { pizzaSizeId: id }
    });

    if (specialtyCount > 0) {
      // Delete specialty pizza size relationships first
      await prisma.specialtyPizzaSize.deleteMany({
        where: { pizzaSizeId: id }
      });
    }
    
    await prisma.pizzaSize.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Size deleted successfully' });
  } catch (error) {
    console.error('Error deleting size:', error);
    return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
  }
}
