import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/management-portal/menu/customization-groups/[id]/clone - Clone a customization group with all its options
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;

    // Get the original group with all its options
    const originalGroup = await prisma.customizationGroup.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!originalGroup) {
      return NextResponse.json({
        success: false,
        error: 'Customization group not found'
      }, { status: 404 });
    }

    // Get the next sort order for the new group
    const maxSortOrder = await prisma.customizationGroup.findFirst({
      where: { categoryId: originalGroup.categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true }
    });

    const nextSortOrder = (maxSortOrder?.sortOrder || 0) + 1;

    // Create the cloned group using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the new group with "Copy of" prefix
      const clonedGroup = await tx.customizationGroup.create({
        data: {
          name: `Copy of ${originalGroup.name}`,
          description: originalGroup.description,
          type: originalGroup.type,
          isRequired: originalGroup.isRequired,
          minSelections: originalGroup.minSelections,
          maxSelections: originalGroup.maxSelections,
          sortOrder: nextSortOrder,
          isActive: true, // Clone as active by default
          categoryId: originalGroup.categoryId
        }
      });

      // Clone all options
      const clonedOptions = await Promise.all(
        originalGroup.options.map(async (option) => {
          return tx.customizationOption.create({
            data: {
              groupId: clonedGroup.id,
              name: option.name,
              description: option.description,
              priceModifier: option.priceModifier,
              priceType: option.priceType,
              isDefault: option.isDefault,
              isActive: option.isActive,
              sortOrder: option.sortOrder,
              maxQuantity: option.maxQuantity,
              nutritionInfo: option.nutritionInfo,
              allergens: option.allergens
            }
          });
        })
      );

      return {
        group: clonedGroup,
        optionsCount: clonedOptions.length
      };
    });

    // Fetch the complete cloned group with counts for response
    const completeClonedGroup = await prisma.customizationGroup.findUnique({
      where: { id: result.group.id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: {
            options: true,
            menuItemCustomizations: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: completeClonedGroup,
      message: `Successfully cloned "${originalGroup.name}" with ${result.optionsCount} options`
    });

  } catch (error) {
    console.error('Error cloning customization group:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clone customization group'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
