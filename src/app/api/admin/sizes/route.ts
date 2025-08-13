import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/sizes - Fetch all sizes
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    
    const sizes = await prisma.pizzaSize.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(sizes);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching sizes:', error);
    return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 });
  }
}

// POST /api/admin/sizes - Create new size
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    
    const { name, diameter } = await request.json();
    
    // Validate required fields
    if (!name || !diameter) {
      return NextResponse.json(
        { error: 'Name and diameter are required' },
        { status: 400 }
      );
    }

    const size = await prisma.pizzaSize.create({
      data: {
        name,
        diameter
      }
    });
    
    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A pizza size with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    console.error('Error creating size:', error);
    return NextResponse.json({ error: 'Failed to create size' }, { status: 500 });
  }
}

// PUT /api/admin/sizes/[id] - Update size (for future use)
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    
    const { name, diameter } = await request.json();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Size ID is required' }, { status: 400 });
    }

    const size = await prisma.pizzaSize.update({
      where: { id },
      data: { name, diameter }
    });
    
    return NextResponse.json(size);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating size:', error);
    return NextResponse.json({ error: 'Failed to update size' }, { status: 500 });
  }
}

// DELETE /api/admin/sizes/[id] - Delete size (for future use)
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Size ID is required' }, { status: 400 });
    }

    await prisma.pizzaSize.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Size deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting size:', error);
    return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
  }
}
