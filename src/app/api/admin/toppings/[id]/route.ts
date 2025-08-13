import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/admin/toppings/[id] - Update topping
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, category, price, available } = await request.json();
    
    // Validate required fields
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    // Convert category to uppercase enum format
    const categoryEnum = category.toUpperCase().replace(/\s+/g, '_');

    const topping = await prisma.pizzaTopping.update({
      where: { id },
      data: {
        name,
        category: categoryEnum as any, // Will be validated by Prisma
        price: parseFloat(price.toString()),
        isActive: available !== undefined ? available : true
      }
    });
    
    return NextResponse.json(topping);
  } catch (error) {
    console.error('Error updating topping:', error);
    return NextResponse.json({ error: 'Failed to update topping' }, { status: 500 });
  }
}

// DELETE /api/admin/toppings/[id] - Delete topping
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.pizzaTopping.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Topping deleted successfully' });
  } catch (error) {
    console.error('Error deleting topping:', error);
    return NextResponse.json({ error: 'Failed to delete topping' }, { status: 500 });
  }
}
