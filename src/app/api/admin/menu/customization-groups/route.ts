import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { MenuValidator } from '@/lib/validation/menu-validation';

const prisma = new PrismaClient();

// GET /api/admin/menu/customization-groups - Get all customization groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const includeOptions = searchParams.get('includeOptions') === 'true';

    const where: any = {};
    if (categoryId) {
      where.OR = [
        { categoryId: categoryId },
        { categoryId: null } // Include global groups
      ];
    }

    const groups = await prisma.customizationGroup.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        ...(includeOptions && {
          options: {
            orderBy: { sortOrder: 'asc' }
          }
        }),
        _count: {
          select: {
            options: true,
            menuItemCustomizations: true
          }
        }
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(groups);

  } catch (error) {
    console.error('Error fetching customization groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customization groups' },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu/customization-groups - Create new customization group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const {
      name,
      description,
      type,
      categoryId,
      isRequired = false,
      minSelections = 0,
      maxSelections,
      sortOrder = 0,
      isActive = true,
      options = []
    } = body;

    // Comprehensive validation
    const validationResult = MenuValidator.validateCustomizationGroup({
      name,
      categoryId,
      description,
      type,
      isRequired,
      minSelections,
      maxSelections,
      sortOrder,
      isActive
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        MenuValidator.formatValidationResponse(validationResult, 'Customization Group'),
        { status: 400 }
      );
    }

    // Show warnings if any
    if (validationResult.warnings && validationResult.warnings.length > 0) {
      console.log('Validation warnings:', validationResult.warnings);
    }

    // Validate type
    const validTypes = ['SINGLE_SELECT', 'MULTI_SELECT', 'QUANTITY_SELECT', 'SPECIAL_LOGIC'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // If categoryId provided, verify category exists
    if (categoryId) {
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

    // Create customization group with options
    const group = await prisma.customizationGroup.create({
      data: {
        name,
        description,
        type,
        categoryId: categoryId || null,
        isRequired,
        minSelections,
        maxSelections,
        sortOrder,
        isActive,
        ...(options && options.length > 0 && {
          options: {
            create: options.map((option: any, index: number) => ({
              name: option.name,
              description: option.description,
              priceModifier: parseFloat(option.priceModifier || 0),
              priceType: option.priceType || 'FLAT',
              isDefault: option.isDefault || false,
              isActive: option.isActive !== undefined ? option.isActive : true,
              sortOrder: index + 1,
              maxQuantity: option.maxQuantity
            }))
          }
        })
      },
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

    console.log('Successfully created customization group:', group.id, group.name);
    return NextResponse.json(group, { status: 201 });

  } catch (error) {
    console.error('Error creating customization group:', error);
    return NextResponse.json(
      { error: 'Failed to create customization group' },
      { status: 500 }
    );
  }
}
