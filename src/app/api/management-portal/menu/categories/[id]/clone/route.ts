import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyManagementToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/management-portal/menu/categories/[id]/clone - Clone a category with all its menu items and customization groups
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

    const categoryId = params.id;

    // Find the original category with all related data
    const originalCategory = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              }
            }
          }
        },
        customizationGroups: {
          include: {
            options: true
          }
        },
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      }
    });

    if (!originalCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Create the cloned category using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the new category with "Copy of" prefix
      const clonedCategory = await tx.menuCategory.create({
        data: {
          name: `Copy of ${originalCategory.name}`,
          slug: `copy-of-${originalCategory.slug}-${Date.now()}`,
          description: originalCategory.description,
          imageUrl: originalCategory.imageUrl,
          parentCategoryId: originalCategory.parentCategoryId,
          sortOrder: originalCategory.sortOrder + 1000, // Place at end
          isActive: true, // Clone as active by default
        }
      });

      // Clone all customization groups that belong directly to this category
      const clonedCustomizationGroups = await Promise.all(
        originalCategory.customizationGroups.map(async (group) => {
          // Create new customization group
          const newGroup = await tx.customizationGroup.create({
            data: {
              categoryId: clonedCategory.id,
              name: `Copy of ${group.name}`,
              description: group.description,
              type: group.type,
              isRequired: group.isRequired,
              minSelections: group.minSelections,
              maxSelections: group.maxSelections,
              sortOrder: group.sortOrder,
              isActive: true
            }
          });

          // Clone all options for this group
          await Promise.all(
            group.options.map(option =>
              tx.customizationOption.create({
                data: {
                  groupId: newGroup.id,
                  name: option.name,
                  description: option.description,
                  priceModifier: option.priceModifier,
                  priceType: option.priceType,
                  isDefault: option.isDefault,
                  sortOrder: option.sortOrder,
                  isActive: option.isActive,
                  maxQuantity: option.maxQuantity,
                  nutritionInfo: option.nutritionInfo,
                  allergens: option.allergens
                }
              })
            )
          );

          return newGroup;
        })
      );

      // Clone all menu items that belong to this category
      const clonedMenuItems = await Promise.all(
        originalCategory.menuItems.map(async (item) => {
          const newItem = await tx.menuItem.create({
            data: {
              name: `Copy of ${item.name}`,
              description: item.description,
              basePrice: item.basePrice,
              categoryId: clonedCategory.id,
              isActive: true,
              isAvailable: item.isAvailable,
              sortOrder: item.sortOrder,
              preparationTime: item.preparationTime,
              allergens: item.allergens,
              nutritionInfo: item.nutritionInfo,
              imageUrl: item.imageUrl
            }
          });

          // Clone customization group connections for this item
          await Promise.all(
            item.customizationGroups.map(itemGroup =>
              tx.menuItemCustomization.create({
                data: {
                  menuItemId: newItem.id,
                  customizationGroupId: itemGroup.customizationGroupId,
                  isRequired: itemGroup.isRequired,
                  sortOrder: itemGroup.sortOrder
                }
              })
            )
          );

          return newItem;
        })
      );

      return {
        category: clonedCategory,
        customizationGroupsCount: clonedCustomizationGroups.length,
        menuItemsCount: clonedMenuItems.length
      };
    });

    // Fetch the complete cloned category with counts for response
    const completeClonedCategory = await prisma.menuCategory.findUnique({
      where: { id: result.category.id },
      include: {
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: completeClonedCategory,
      message: `Successfully cloned "${originalCategory.name}" with ${result.menuItemsCount} menu items and ${result.customizationGroupsCount} customization groups`
    });

  } catch (error) {
    console.error('Error cloning category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clone category'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
