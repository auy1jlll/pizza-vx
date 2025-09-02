import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/management-portal/menu/categories/[id] - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const category = await prisma.menuCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH /api/management-portal/menu/categories/[id] - Update category
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    console.log('Updating category:', id, 'with data:', body);

    // Validate parentCategoryId if provided
    if (body.parentCategoryId !== undefined && body.parentCategoryId !== null && body.parentCategoryId !== '') {
      const parentExists = await prisma.menuCategory.findUnique({
        where: { id: body.parentCategoryId }
      });
      
      if (!parentExists) {
        return NextResponse.json({
          success: false,
          error: `Parent category with ID ${body.parentCategoryId} does not exist`
        }, { status: 400 });
      }
      
      // Prevent setting self as parent
      if (body.parentCategoryId === id) {
        return NextResponse.json({
          success: false,
          error: 'A category cannot be its own parent'
        }, { status: 400 });
      }
    }

    // Clean up empty string parentCategoryId
    const updateData = { ...body };
    if (updateData.parentCategoryId === '') {
      updateData.parentCategoryId = null;
    }

    const category = await prisma.menuCategory.update({
      where: { id },
      data: updateData,
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
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error instanceof Error && error.message.includes('P2003')) {
      return NextResponse.json({
        success: false,
        error: 'Foreign key constraint violation. Please check that all referenced items exist.'
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/management-portal/menu/categories/[id] - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    console.log('DELETE category attempt - ID:', id);

    // Check if category exists first
    const existingCategory = await prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      console.log('Category not found:', id);
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    console.log('Category found:', existingCategory.name);

    // Check if category has menu items
    const itemCount = await prisma.menuItem.count({
      where: { categoryId: id }
    });
    
    console.log('Menu items count:', itemCount);

    if (itemCount > 0) {
      console.log('Cannot delete - has menu items:', itemCount);
      return NextResponse.json(
        { success: false, error: `Cannot delete category with existing menu items (${itemCount} items found)` },
        { status: 400 }
      );
    }

    // Check if category has subcategories
    const subcategoryCount = await prisma.menuCategory.count({
      where: { parentCategoryId: id }
    });
    
    console.log('Subcategories count:', subcategoryCount);

    if (subcategoryCount > 0) {
      console.log('Cannot delete - has subcategories:', subcategoryCount);
      return NextResponse.json(
        { success: false, error: `Cannot delete category with subcategories (${subcategoryCount} subcategories found)` },
        { status: 400 }
      );
    }

    console.log('Proceeding with deletion...');
    
    // Use a transaction to ensure deletion is atomic
    const result = await prisma.$transaction(async (tx) => {
      // Double-check the category still exists within the transaction
      const categoryToDelete = await tx.menuCategory.findUnique({
        where: { id }
      });
      
      if (!categoryToDelete) {
        throw new Error('Category not found in transaction');
      }
      
      // Perform the deletion
      const deletedCategory = await tx.menuCategory.delete({
        where: { id }
      });
      
      return deletedCategory;
    });

    console.log('Category deleted successfully:', id, result);
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      meta: (error as any)?.meta
    });
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
