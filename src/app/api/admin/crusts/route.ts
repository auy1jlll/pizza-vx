import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/crusts - Fetch all crusts
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    
    const crusts = await prisma.pizzaCrust.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(crusts);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching crusts:', error);
    return NextResponse.json({ error: 'Failed to fetch crusts' }, { status: 500 });
  }
}

// POST /api/admin/crusts - Create new crust
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    
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
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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
    requireAdmin(request);
    
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
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating crust:', error);
    return NextResponse.json({ error: 'Failed to update crust' }, { status: 500 });
  }
}

// DELETE /api/admin/crusts - Delete crust
export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    
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
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting crust:', error);
    return NextResponse.json({ error: 'Failed to delete crust' }, { status: 500 });
  }
}
