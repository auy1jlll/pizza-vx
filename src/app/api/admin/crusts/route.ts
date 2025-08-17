import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/crusts - Fetch all crusts
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const crusts = await prisma.pizzaCrust.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(crusts);
  } catch (error) {
    console.error('Error fetching crusts:', error);
    return NextResponse.json({ error: 'Failed to fetch crusts' }, { status: 500 });
  }
}

// POST /api/admin/crusts - Create new crust
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, description, priceModifier } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const crust = await prisma.pizzaCrust.create({
      data: {
        name,
        description,
        priceModifier: parseFloat(priceModifier?.toString() || '0')
      }
    });
    
    return NextResponse.json(crust, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A crust with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    console.error('Error creating crust:', error);
    return NextResponse.json({ error: 'Failed to create crust' }, { status: 500 });
  }
}

// PUT /api/admin/crusts - Update crust
export async function PUT(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, name, description, priceModifier } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Crust ID is required' }, { status: 400 });
    }

    const crust = await prisma.pizzaCrust.update({
      where: { id },
      data: { 
        name, 
        description, 
        priceModifier: parseFloat(priceModifier?.toString() || '0')
      }
    });
    
    return NextResponse.json(crust);
  } catch (error) {
    console.error('Error updating crust:', error);
    return NextResponse.json({ error: 'Failed to update crust' }, { status: 500 });
  }
}

// DELETE /api/admin/crusts - Delete crust
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Crust ID is required' }, { status: 400 });
    }

    await prisma.pizzaCrust.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Crust deleted successfully' });
  } catch (error) {
    console.error('Error deleting crust:', error);
    return NextResponse.json({ error: 'Failed to delete crust' }, { status: 500 });
  }
}
