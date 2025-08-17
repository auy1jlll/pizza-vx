import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const customizationOptions = await prisma.customizationOption.findMany({
      include: {
        group: true
      },
      orderBy: [
        { group: { name: 'asc' } },
        { sortOrder: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: customizationOptions
    });
  } catch (error) {
    console.error('Error fetching customization options:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customization options'
    }, { status: 500 });
  }
}
