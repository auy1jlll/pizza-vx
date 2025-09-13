import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const sizes = await prisma.pizzaSize.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      },
      select: {
        id: true,
        name: true,
        diameter: true,
        basePrice: true,
        isActive: true,
        sortOrder: true
      }
    });

    return NextResponse.json({
      success: true,
      data: sizes
    });

  } catch (error) {
    console.error('Error fetching pizza sizes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pizza sizes'
      },
      { status: 500 }
    );
  }
}