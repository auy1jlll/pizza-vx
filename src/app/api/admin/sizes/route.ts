import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// GET /api/admin/sizes - Fetch all sizes
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-get', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    // Verify admin authentication
    const user = verifyAdminToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const sizes = await prisma.pizzaSize.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(sizes);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 });
  }
}

// POST /api/admin/sizes - Create new size
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-post', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    // Verify admin authentication
    const user = verifyAdminToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { name, diameter, basePrice } = await request.json();
    
    // Validate required fields
    if (!name || !diameter || basePrice === undefined) {
      return NextResponse.json(
        { error: 'Name, diameter, and base price are required' },
        { status: 400 }
      );
    }

    const size = await prisma.pizzaSize.create({
      data: {
        name,
        diameter,
        basePrice: parseFloat(basePrice)
      }
    });
    
    return NextResponse.json(size, { status: 201 });
  } catch (error) {
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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-put', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    const user = verifyAdminToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { name, diameter, basePrice } = await request.json();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Size ID is required' }, { status: 400 });
    }

    const size = await prisma.pizzaSize.update({
      where: { id },
      data: { 
        name, 
        diameter,
        basePrice: parseFloat(basePrice)
      }
    });
    
    return NextResponse.json(size);
  } catch (error) {
    console.error('Error updating size:', error);
    return NextResponse.json({ error: 'Failed to update size' }, { status: 500 });
  }
}

// DELETE /api/admin/sizes/[id] - Delete size (for future use)
export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-sizes-delete', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }
    const user = verifyAdminToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
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
    console.error('Error deleting size:', error);
    return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 });
  }
}
