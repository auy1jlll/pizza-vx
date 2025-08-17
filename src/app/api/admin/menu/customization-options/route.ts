import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const customizationOptions = await prisma.customizationOption.findMany({
      include: {
        group: {
          select: {
            id: true,
            name: true,
            type: true,
            categoryId: true
          }
        }
      },
      orderBy: [
        { group: { name: 'asc' } },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: customizationOptions
    });
  } catch (error) {
    console.error('Error fetching customization options:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch customization options'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groupId,
      name,
      description,
      priceModifier = 0,
      priceType = 'FLAT',
      isDefault = false,
      isActive = true,
      sortOrder = 0,
      maxQuantity,
      nutritionInfo,
      allergens
    } = body;

    // Validate required fields
    if (!groupId || !name) {
      return NextResponse.json({
        success: false,
        error: 'Group ID and name are required'
      }, { status: 400 });
    }

    // Check if group exists
    const group = await prisma.customizationGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json({
        success: false,
        error: 'Customization group not found'
      }, { status: 404 });
    }

    const customizationOption = await prisma.customizationOption.create({
      data: {
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
      data: customizationOption
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customization option:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create customization option'
    }, { status: 500 });
  }
}
