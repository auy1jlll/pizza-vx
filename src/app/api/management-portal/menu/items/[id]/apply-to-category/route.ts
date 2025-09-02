import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/management-portal/menu/items/[id]/apply-to-category
// Apply this item's customizations to all other items in the same category
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { customizationGroups } = body;

    if (!customizationGroups || !Array.isArray(customizationGroups)) {
      return NextResponse.json(
        { error: 'Invalid customization groups data' },
        { status: 400 }
      );
    }

    // Get the current menu item to find its category
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Get all other menu items in the same category (excluding the current one)
    const otherItemsInCategory = await prisma.menuItem.findMany({
      where: {
        categoryId: menuItem.categoryId,
        id: { not: id }, // Exclude the current item
        isActive: true
      }
    });

    let updatedItemsCount = 0;

    // Apply customizations to each item in the category
    for (const otherItem of otherItemsInCategory) {
      for (const customizationGroupId of customizationGroups) {
        // Check if this item already has this customization group
        const existingCustomization = await prisma.menuItemCustomization.findUnique({
          where: {
            menuItemId_customizationGroupId: {
              menuItemId: otherItem.id,
              customizationGroupId: customizationGroupId
            }
          }
        });

        // Only add if it doesn't already exist
        if (!existingCustomization) {
          await prisma.menuItemCustomization.create({
            data: {
              menuItemId: otherItem.id,
              customizationGroupId: customizationGroupId,
              isRequired: false, // Default to not required for bulk application
              sortOrder: 999 // Place at the end by default
            }
          });
        }
      }
      updatedItemsCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Applied customizations to ${updatedItemsCount} items in ${menuItem.category.name} category`,
      updatedItemsCount,
      categoryName: menuItem.category.name,
      appliedCustomizations: customizationGroups.length
    });

  } catch (error) {
    console.error('Error applying customizations to category:', error);
    return NextResponse.json(
      { error: 'Failed to apply customizations to category' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
