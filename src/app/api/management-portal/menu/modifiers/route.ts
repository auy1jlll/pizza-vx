import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/management-portal/menu/modifiers - List modifiers
async function getModifiersHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (!includeInactive) {
      where.isActive = true;
    }

    const [modifiers, total] = await Promise.all([
      prisma.modifier.findMany({
        where,
        include: {
          _count: {
            select: {
              items: true
            }
          }
        },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.modifier.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: modifiers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching modifiers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modifiers' },
      { status: 500 }
    );
  }
}

// POST /api/management-portal/menu/modifiers - Create modifier
async function createModifierHandler(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      name,
      type,
      price = 0,
      isActive = true
    } = data;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Validate modifier type
    const validTypes = ['TOPPING', 'SIDE', 'DRESSING', 'CONDIMENT', 'SIZE'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const modifier = await prisma.modifier.create({
      data: {
        name,
        type,
        price: parseFloat(price),
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: modifier,
      message: 'Modifier created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating modifier:', error);
    
    // Handle unique constraint errors
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A modifier with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create modifier' },
      { status: 500 }
    );
  }
}

export const GET = getModifiersHandler;
export const POST = createModifierHandler;
