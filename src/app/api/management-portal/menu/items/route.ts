import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MenuValidator } from '@/lib/validation/menu-validation';

// GET /api/admin/menu/items - Get all menu items with pagination and modifiers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const offset = (page - 1) * limit;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (!includeInactive) {
      where.isActive = true;
    }

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  options: true
                }
              }
            }
          },
          _count: {
            select: {
              customizationGroups: true
            }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.menuItem.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu/items - Create new menu item with modifiers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received menu item creation request:', JSON.stringify(body, null, 2));
    
    const {
      name,
      description,
      basePrice,
      categoryId,
      isActive = true,
      isAvailable = true,
      sortOrder,
      preparationTime,
      allergens,
      nutritionInfo,
      customizationGroups = [],
      modifiers = []
    } = body;

    console.log('Parsed data:', { 
      name, 
      categoryId, 
      basePrice: typeof basePrice + ' - ' + basePrice, 
      customizationGroups: customizationGroups.length 
    });

    // Comprehensive validation
    const validationResult = MenuValidator.validateItem({
      name,
      categoryId,
      basePrice,
      description,
      imageUrl: undefined, // Not provided in this request
      isActive,
      isAvailable,
      sortOrder,
      preparationTime,
      allergens,
      nutritionInfo
    });

    if (!validationResult.isValid) {
      console.log('Validation failed:', validationResult.errors);
      return NextResponse.json(
        MenuValidator.formatValidationResponse(validationResult, 'Menu Item'),
        { status: 400 }
      );
    }

    // Show warnings if any
    if (validationResult.warnings && validationResult.warnings.length > 0) {
      console.log('Validation warnings:', validationResult.warnings);
    }

    // Validate category exists
    console.log('Checking if category exists:', categoryId);
    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      console.log('Category not found:', categoryId);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    console.log('Category found:', category.name);

    // Create menu item with transaction
    console.log('Starting transaction to create menu item...');
    const menuItem = await prisma.$transaction(async (tx) => {
      // Create the menu item
      const item = await tx.menuItem.create({
        data: {
          name,
          description,
          basePrice: Math.round(parseFloat(basePrice.toString()) * 100), // Convert dollars to cents
          categoryId,
          isActive,
          isAvailable,
          sortOrder: sortOrder || 0,
          preparationTime,
          allergens,
          nutritionInfo
        }
      });
      console.log('Menu item created:', item.id);

      // Add customization groups if provided
      if (customizationGroups.length > 0) {
        console.log('Adding customization groups:', customizationGroups.length);
        await tx.menuItemCustomization.createMany({
          data: customizationGroups.map((groupId: string) => ({
            menuItemId: item.id,
            customizationGroupId: groupId
          }))
        });
        console.log('Customization groups added');
      }

      return item;
    });

    // Fetch the complete item with relations
    const completeItem = await prisma.menuItem.findUnique({
      where: { id: menuItem.id },
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
        }
      }
    });

    console.log('Menu item created successfully:', completeItem?.id);
    return NextResponse.json(completeItem);

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
