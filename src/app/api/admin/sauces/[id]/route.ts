import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/admin/sauces/[id] - Update sauce
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, color, spiceLevel, priceModifier } = await request.json();
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const sauce = await prisma.pizzaSauce.update({
      where: { id },
      data: {
        name,
        description,
        color: color || '#ff0000',
        spiceLevel: parseInt(spiceLevel?.toString() || '0'),
        priceModifier: parseFloat(priceModifier?.toString() || '0')
      }
    });
    
    return NextResponse.json(sauce);
  } catch (error) {
    console.error('Error updating sauce:', error);
    return NextResponse.json({ error: 'Failed to update sauce' }, { status: 500 });
  }
}

// DELETE /api/admin/sauces/[id] - Delete sauce
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.pizzaSauce.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Sauce deleted successfully' });
  } catch (error) {
    console.error('Error deleting sauce:', error);
    return NextResponse.json({ error: 'Failed to delete sauce' }, { status: 500 });
  }
}
