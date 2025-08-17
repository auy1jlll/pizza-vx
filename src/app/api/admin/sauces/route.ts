import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/sauces - Fetch all sauces
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sauces = await prisma.pizzaSauce.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(sauces);
  } catch (error) {
    console.error('Error fetching sauces:', error);
    return NextResponse.json({ error: 'Failed to fetch sauces' }, { status: 500 });
  }
}

// POST /api/admin/sauces - Create new sauce
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, description, color, spiceLevel, priceModifier } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const sauce = await prisma.pizzaSauce.create({
      data: {
        name,
        description,
        color,
        spiceLevel: parseInt(spiceLevel?.toString() || '0'),
        priceModifier: parseFloat(priceModifier?.toString() || '0')
      }
    });
    
    return NextResponse.json(sauce, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A sauce with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    console.error('Error creating sauce:', error);
    return NextResponse.json({ error: 'Failed to create sauce' }, { status: 500 });
  }
}

// PUT /api/admin/sauces - Update sauce
export async function PUT(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, name, description, color, spiceLevel, priceModifier } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Sauce ID is required' }, { status: 400 });
    }

    const sauce = await prisma.pizzaSauce.update({
      where: { id },
      data: { 
        name, 
        description, 
        color,
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

// DELETE /api/admin/sauces - Delete sauce
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Sauce ID is required' }, { status: 400 });
    }

    await prisma.pizzaSauce.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Sauce deleted successfully' });
  } catch (error) {
    console.error('Error deleting sauce:', error);
    return NextResponse.json({ error: 'Failed to delete sauce' }, { status: 500 });
  }
}
