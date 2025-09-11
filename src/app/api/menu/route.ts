import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Return complete menu structure with categories and items
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          where: { 
            isActive: true,
            isAvailable: true 
          },
          select: {
            id: true,
            name: true,
            description: true,
            basePrice: true,
            imageUrl: true,
            preparationTime: true,
            allergens: true,
            sortOrder: true
          },
          orderBy: { sortOrder: 'asc' }
        },
        subcategories: {
          where: { isActive: true },
          include: {
            menuItems: {
              where: { 
                isActive: true,
                isAvailable: true 
              },
              select: {
                id: true,
                name: true,
                description: true,
                basePrice: true,
                imageUrl: true,
                preparationTime: true,
                allergens: true,
                sortOrder: true
              },
              orderBy: { sortOrder: 'asc' }
            },
            _count: {
              select: { menuItems: true }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    const menu = {
      categories,
      totalCategories: categories.length,
      totalItems: categories.reduce((sum, cat) => sum + cat._count.menuItems, 0)
    };

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}