import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// PUT /api/admin/crusts/[id] - Update crust
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const user = verifyAdminToken(request as NextRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { name, description, priceModifier } = await request.json();
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
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

// DELETE /api/admin/crusts/[id] - Delete crust
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const user = verifyAdminToken(request as NextRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    
    await prisma.pizzaCrust.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Crust deleted successfully' });
  } catch (error) {
    console.error('Error deleting crust:', error);
    return NextResponse.json({ error: 'Failed to delete crust' }, { status: 500 });
  }
}
