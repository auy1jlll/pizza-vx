import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pizzaSizes = await prisma.pizzaSize.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(pizzaSizes);
  } catch (error) {
    console.error('Error fetching pizza sizes:', error);
    return NextResponse.json({ error: 'Failed to fetch pizza sizes' }, { status: 500 });
  }
}