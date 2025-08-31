import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/menu/stats - Get menu statistics
export async function GET(request: NextRequest) {
  try {
    const [
      totalCategories,
      totalMenuItems,
      totalCustomizationGroups,
      totalCustomizationOptions
    ] = await Promise.all([
      prisma.menuCategory.count(),
      prisma.menuItem.count(),
      prisma.customizationGroup.count(),
      prisma.customizationOption.count()
    ]);

    const stats = {
      totalCategories,
      totalMenuItems,
      totalCustomizationGroups,
      totalCustomizationOptions
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching menu stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu stats' },
      { status: 500 }
    );
  }
}
