import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/management-portal/menu/modifiers/[id] - Get single modifier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const modifier = await prisma.modifier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    if (!modifier) {
      return NextResponse.json(
        { success: false, error: 'Modifier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: modifier
    });

  } catch (error) {
    console.error('Error fetching modifier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modifier' },
      { status: 500 }
    );
  }
}

// PUT /api/management-portal/menu/modifiers/[id] - Update modifier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const {
      name,
      type,
      price,
      isActive
    } = data;

    // Check if modifier exists
    const existingModifier = await prisma.modifier.findUnique({
      where: { id }
    });

    if (!existingModifier) {
      return NextResponse.json(
        { success: false, error: 'Modifier not found' },
        { status: 404 }
      );
    }

    // Validate modifier type if provided
    if (type) {
      const validTypes = ['TOPPING', 'SIDE', 'DRESSING', 'CONDIMENT', 'SIZE'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { success: false, error: `Type must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const updatedModifier = await prisma.modifier.update({
      where: { id },
      data: {
        name,
        type,
        price: price !== undefined ? parseFloat(price) : undefined,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedModifier,
      message: 'Modifier updated successfully'
    });

  } catch (error) {
    console.error('Error updating modifier:', error);
    
    // Handle unique constraint errors
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A modifier with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update modifier' },
      { status: 500 }
    );
  }
}

// DELETE /api/management-portal/menu/modifiers/[id] - Delete modifier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if modifier exists
    const existingModifier = await prisma.modifier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    if (!existingModifier) {
      return NextResponse.json(
        { success: false, error: 'Modifier not found' },
        { status: 404 }
      );
    }

    // Check if modifier is being used by items
    if (existingModifier._count.items > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete modifier that is used by menu items. Please deactivate instead.' },
        { status: 400 }
      );
    }

    await prisma.modifier.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Modifier deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting modifier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete modifier' },
      { status: 500 }
    );
  }
}
