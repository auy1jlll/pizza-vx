import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Query database for dinner plate items using correct schema
    const dinnerPlates = await prisma.menuItem.findMany({
      where: {
        category: { slug: 'dinner-plates' },
        isAvailable: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        category: dinnerPlates[0]?.category || { 
          id: 'dinner-plates', 
          name: 'Dinner Plates', 
          slug: 'dinner-plates' 
        },
        items: dinnerPlates
      }
    });
  } catch (error) {
    console.error('Database error fetching dinner plates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dinner plates from database' },
      { status: 500 }
    );
  }
}
