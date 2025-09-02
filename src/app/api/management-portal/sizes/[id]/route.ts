import { NextRequest, NextResponse } from 'next/server';
import { verifyManagementToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// GET /api/management-portal/sizes/[id] - Get single size
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-get', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    
    // Verify management authentication
    const user = verifyManagementToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await params;
    
    const size = await prisma.pizzaSize.findUnique({
      where: { id }
    });
    
    if (!size) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }
    
    return NextResponse.json(size);
  } catch (error) {
    console.error('Error fetching size:', error);
    return NextResponse.json({ error: 'Failed to fetch size' }, { status: 500 });
  }
}

// PUT /api/management-portal/sizes/[id] - Update size
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-put', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    
    // Verify management authentication
    const user = verifyManagementToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await params;
    const { name, diameter, basePrice, productType, isActive, sortOrder } = await request.json();
    
    // Validate required fields
    if (!name || !diameter || basePrice === undefined) {
      return NextResponse.json(
        { error: 'Name, diameter, and base price are required' },
        { status: 400 }
      );
    }

    // Check if size exists
    const existingSize = await prisma.pizzaSize.findUnique({
      where: { id }
    });

    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    const updatedSize = await prisma.pizzaSize.update({
      where: { id },
      data: { 
        name, 
        diameter,
        basePrice: parseFloat(basePrice),
        productType: productType || existingSize.productType,
        isActive: isActive !== undefined ? isActive : existingSize.isActive,
        sortOrder: sortOrder !== undefined ? sortOrder : existingSize.sortOrder
      }
    });
    
    console.log('Updated size:', updatedSize);
    return NextResponse.json(updatedSize);
  } catch (error) {
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A pizza size with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    console.error('Error updating size:', error);
    return NextResponse.json({ error: 'Failed to update size' }, { status: 500 });
  }
}

// DELETE /api/management-portal/sizes/[id] - Delete size
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-delete', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    
    // Verify management authentication
    const user = verifyManagementToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await params;

    // Check if size exists
    const existingSize = await prisma.pizzaSize.findUnique({
      where: { id }
    });

    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 });
    }

    // Check if size is being used in any orders
    const usageCount = await prisma.orderItem.count({
      where: { 
        pizzaSize: { id }
      }
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete size as it is being used in existing orders' },
        { status: 400 }
      );
    }

    await prisma.pizzaSize.delete({
      where: { id }
    });
    
    console.log('Deleted size with ID:', id);
    return NextResponse.json({ message: 'Size deleted successfully' });
  } catch (error) {
    console.error('Error deleting size:', error);
    return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
  }
}
