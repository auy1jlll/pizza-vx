import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItemId = params.id;

    if (!menuItemId) {
      return NextResponse.json({
        success: false,
        message: 'Menu item ID is required'
      }, { status: 400 });
    }

    // Fetch menu item with category and customization groups
    const menuItem = await prisma.menuItem.findUnique({
      where: { 
        id: menuItemId,
        isActive: true,
        isAvailable: true 
      },
      include: {
        category: true,
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
      }
    });

    if (!menuItem) {
      return NextResponse.json({
        success: false,
        message: 'Menu item not found or not available'
      }, { status: 404 });
    }

    // Transform the data to match our interface
    const customizationGroups = menuItem.customizationGroups.map(mcg => ({
      id: mcg.customizationGroup.id,
      categoryId: mcg.customizationGroup.categoryId,
      name: mcg.customizationGroup.name,
      description: mcg.customizationGroup.description,
      type: mcg.customizationGroup.type,
      isRequired: mcg.isRequired, // Use the menu-item-specific requirement
      minSelections: mcg.customizationGroup.minSelections,
      maxSelections: mcg.customizationGroup.maxSelections,
      sortOrder: mcg.sortOrder, // Use the menu-item-specific sort order
      isActive: mcg.customizationGroup.isActive,
      options: mcg.customizationGroup.options
    }));

    const result = {
      menuItem: {
        id: menuItem.id,
        categoryId: menuItem.categoryId,
        name: menuItem.name,
        description: menuItem.description,
        basePrice: menuItem.basePrice,
        imageUrl: menuItem.imageUrl,
        isActive: menuItem.isActive,
        isAvailable: menuItem.isAvailable,
        sortOrder: menuItem.sortOrder,
        preparationTime: menuItem.preparationTime,
        allergens: menuItem.allergens,
        nutritionInfo: menuItem.nutritionInfo,
        category: menuItem.category
      },
      customizationGroups
    };

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching menu item customization:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}
