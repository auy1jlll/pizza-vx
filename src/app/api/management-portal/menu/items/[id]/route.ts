import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/menu/items/[id] - Get single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/menu/items/[id] - Update menu item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      basePrice,
      categoryId,
      isActive,
      isAvailable,
      sortOrder,
      preparationTime,
      customizationGroups = []
    } = body;

    // Check if item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // If categoryId is being changed, verify new category exists
    if (categoryId && categoryId !== existingItem.categoryId) {
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

    // Update menu item and customization links
    const updatedItem = await prisma.$transaction(async (tx) => {
      // Update the menu item
      const item = await tx.menuItem.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(basePrice !== undefined && { basePrice: Math.round(parseFloat(basePrice) * 100) }), // Convert dollars to cents
          ...(categoryId && { categoryId }),
          ...(isActive !== undefined && { isActive }),
          ...(isAvailable !== undefined && { isAvailable }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(preparationTime !== undefined && { preparationTime })
        }
      });

      // If customization groups are provided, update them
      if (customizationGroups && customizationGroups.length >= 0) {
        // Remove existing customization links
        await tx.menuItemCustomization.deleteMany({
          where: { menuItemId: id }
        });

        // Add new customization links (only if we have groups to add)
        if (customizationGroups.length > 0) {
          await tx.menuItemCustomization.createMany({
            data: customizationGroups.map((groupId: string, index: number) => ({
              menuItemId: id,
              customizationGroupId: groupId,
              isRequired: false,
              sortOrder: index + 1
            }))
          });
        }
      }

      // Return updated item with relations
      return await tx.menuItem.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          customizationGroups: {
            include: {
              customizationGroup: {
                select: { id: true, name: true, type: true }
              }
            },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    });

    return NextResponse.json(updatedItem);

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu/items/[id] - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        cartItems: true
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Check if item is referenced in any active cart items
    if (existingItem.cartItems.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete menu item - it is currently in customer carts. Please deactivate it instead.' 
        },
        { status: 400 }
      );
    }

    // Delete the item (will cascade delete customization links)
    await prisma.menuItem.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
