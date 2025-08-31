import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/menu/customization-groups/[id] - Get single customization group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;

    const group = await prisma.customizationGroup.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        options: {
          orderBy: { sortOrder: 'asc' }
        },
        menuItemCustomizations: {
          include: {
            menuItem: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: {
            options: true,
            menuItemCustomizations: true
          }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Customization group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(group);

  } catch (error) {
    console.error('Error fetching customization group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customization group' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/menu/customization-groups/[id] - Update customization group
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      type,
      categoryId,
      isRequired,
      minSelections,
      maxSelections,
      sortOrder,
      isActive,
      options
    } = body;

    // Check if group exists
    const existingGroup = await prisma.customizationGroup.findUnique({
      where: { id }
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Customization group not found' },
        { status: 404 }
      );
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['SINGLE_SELECT', 'MULTI_SELECT', 'QUANTITY_SELECT', 'SPECIAL_LOGIC'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // If categoryId is being changed, verify new category exists
    if (categoryId !== undefined && categoryId !== existingGroup.categoryId) {
      if (categoryId !== null) {
        const category = await prisma.menuCategory.findUnique({
          where: { id: categoryId }
        });

        if (!category) {
          return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
          );
        }
      }
    }

    // Update customization group and options
    const updatedGroup = await prisma.$transaction(async (tx) => {
      // Update the group
      const group = await tx.customizationGroup.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(type && { type }),
          ...(categoryId !== undefined && { categoryId }),
          ...(isRequired !== undefined && { isRequired }),
          ...(minSelections !== undefined && { minSelections }),
          ...(maxSelections !== undefined && { maxSelections }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive })
        }
      });

      // If options are provided, update them
      if (options && Array.isArray(options)) {
        // Remove existing options
        await tx.customizationOption.deleteMany({
          where: { groupId: id }
        });

        // Add new options
        if (options.length > 0) {
          await tx.customizationOption.createMany({
            data: options.map((option: any, index: number) => ({
              groupId: id,
              name: option.name,
              description: option.description,
              priceModifier: parseFloat(option.priceModifier || 0),
              priceType: option.priceType || 'FLAT',
              isDefault: option.isDefault || false,
              isActive: option.isActive !== undefined ? option.isActive : true,
              sortOrder: index + 1,
              maxQuantity: option.maxQuantity
            }))
          });
        }
      }

      // Return updated group with relations
      return await tx.customizationGroup.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          options: {
            orderBy: { sortOrder: 'asc' }
          },
          _count: {
            select: {
              options: true,
              menuItemCustomizations: true
            }
          }
        }
      });
    });

    return NextResponse.json(updatedGroup);

  } catch (error) {
    console.error('Error updating customization group:', error);
    return NextResponse.json(
      { error: 'Failed to update customization group' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu/customization-groups/[id] - Delete customization group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;

    // Check if group exists
    const existingGroup = await prisma.customizationGroup.findUnique({
      where: { id },
      include: {
        menuItemCustomizations: true
      }
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Customization group not found' },
        { status: 404 }
      );
    }

    // Check if group is referenced by any menu items
    if (existingGroup.menuItemCustomizations.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete customization group - it is being used by menu items. Please deactivate it instead.' 
        },
        { status: 400 }
      );
    }

    // Delete the group (will cascade delete options)
    await prisma.customizationGroup.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Customization group deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting customization group:', error);
    return NextResponse.json(
      { error: 'Failed to delete customization group' },
      { status: 500 }
    );
  }
}
