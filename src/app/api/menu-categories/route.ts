import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          where: { isActive: true },
          select: { id: true, name: true, basePrice: true }
        },
        subcategories: {
          where: { isActive: true },
          include: {
            menuItems: {
              where: { isActive: true },
              select: { id: true, name: true, basePrice: true }
            }
          }
        },
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return NextResponse.json({ error: 'Failed to fetch menu categories' }, { status: 500 });
  }
}