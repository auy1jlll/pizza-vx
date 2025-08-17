import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const customizationOption = await prisma.customizationOption.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            type: true,
            categoryId: true
          }
        }
      }
    });

    if (!customizationOption) {
      return NextResponse.json({
        success: false,
        error: 'Customization option not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: customizationOption
    });
  } catch (error) {
    console.error('Error fetching customization option:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customization option'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      groupId,
      name,
      description,
      priceModifier,
      priceType,
      isDefault,
      isActive,
      sortOrder,
      maxQuantity,
      nutritionInfo,
      allergens
    } = body;

    // Check if option exists
    const existingOption = await prisma.customizationOption.findUnique({
      where: { id }
    });

    if (!existingOption) {
      return NextResponse.json({
        success: false,
        error: 'Customization option not found'
      }, { status: 404 });
    }

    // If groupId is being changed, verify the new group exists
    if (groupId && groupId !== existingOption.groupId) {
      const group = await prisma.customizationGroup.findUnique({
        where: { id: groupId }
      });

      if (!group) {
        return NextResponse.json({
          success: false,
          error: 'Customization group not found'
        }, { status: 404 });
      }
    }

    const updatedOption = await prisma.customizationOption.update({
      where: { id },
      data: {
        ...(groupId && { groupId }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(priceModifier !== undefined && { priceModifier }),
        ...(priceType && { priceType }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(maxQuantity !== undefined && { maxQuantity }),
        ...(nutritionInfo !== undefined && { nutritionInfo }),
        ...(allergens !== undefined && { allergens })
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedOption
    });
  } catch (error) {
    console.error('Error updating customization option:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update customization option'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if option exists and if it's being used
    const existingOption = await prisma.customizationOption.findUnique({
      where: { id }
    });

    if (!existingOption) {
      return NextResponse.json({
        success: false,
        error: 'Customization option not found'
      }, { status: 404 });
    }

    // For now, allow deletion (we can add usage checks later)
    // In production, you'd want to check if this option is referenced in orders

    await prisma.customizationOption.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Customization option deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customization option:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete customization option'
    }, { status: 500 });
  }
}
