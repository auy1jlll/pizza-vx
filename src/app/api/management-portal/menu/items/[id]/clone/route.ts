import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyManagementToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/management-portal/menu/items/[id]/clone - Clone a menu item with all its customization groups
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify management token (allows both ADMIN and EMPLOYEE roles)
    const verification = verifyManagementToken(request);
    if (!verification) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized access' 
      }, { status: 401 });
    }

    const itemId = params.id;

    // Find the original menu item with all related data
    const originalItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        },
        modifiers: {
          include: {
            modifier: true
          }
        }
      }
    });

    if (!originalItem) {
      return NextResponse.json({
        success: false,
        error: 'Menu item not found'
      }, { status: 404 });
    }

    // Create the cloned menu item using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the new menu item with "Copy of" prefix
      const clonedItem = await tx.menuItem.create({
        data: {
          name: `Copy of ${originalItem.name}`,
          description: originalItem.description,
          basePrice: originalItem.basePrice,
          categoryId: originalItem.categoryId,
          imageUrl: originalItem.imageUrl,
          isActive: true, // Clone as active by default
          isAvailable: originalItem.isAvailable,
          sortOrder: originalItem.sortOrder + 1000, // Place at end
          preparationTime: originalItem.preparationTime,
          allergens: originalItem.allergens,
          nutritionInfo: originalItem.nutritionInfo
        }
      });

      // Clone customization group connections
      const clonedCustomizations = await Promise.all(
        originalItem.customizationGroups.map(itemGroup =>
          tx.menuItemCustomization.create({
            data: {
              menuItemId: clonedItem.id,
              customizationGroupId: itemGroup.customizationGroupId,
              isRequired: itemGroup.isRequired,
              sortOrder: itemGroup.sortOrder
            }
          })
        )
      );

      // Clone modifier connections
      const clonedModifiers = await Promise.all(
        originalItem.modifiers.map(itemModifier =>
          tx.itemModifier.create({
            data: {
              itemId: clonedItem.id,
              modifierId: itemModifier.modifierId,
              isDefault: itemModifier.isDefault,
              maxSelectable: itemModifier.maxSelectable
            }
          })
        )
      );

      return {
        item: clonedItem,
        customizationsCount: clonedCustomizations.length,
        modifiersCount: clonedModifiers.length
      };
    });

    // Fetch the complete cloned item with counts for response
    const completeClonedItem = await prisma.menuItem.findUnique({
      where: { id: result.item.id },
      include: {
        category: true,
        _count: {
          select: {
            customizationGroups: true,
            modifiers: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: completeClonedItem,
      message: `Successfully cloned "${originalItem.name}" with ${result.customizationsCount} customization groups and ${result.modifiersCount} modifiers`
    });

  } catch (error) {
    console.error('Error cloning menu item:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clone menu item'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
