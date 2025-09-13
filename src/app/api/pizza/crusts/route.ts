import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const crusts = await prisma.pizzaCrust.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceModifier: true,
        isActive: true,
        sortOrder: true
      }
    });

    return NextResponse.json({
      success: true,
      data: crusts
    });

  } catch (error) {
    console.error('Error fetching pizza crusts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pizza crusts'
      },
      { status: 500 }
    );
  }
}