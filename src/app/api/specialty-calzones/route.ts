import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📥 Fetching specialty calzones from new table...');
    
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      where: {
        isActive: true
      },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: {
        calzoneName: 'asc'
      }
    });

    // Transform to match frontend expectations
    const transformedCalzones = specialtyCalzones.map(calzone => ({
      id: calzone.id,
      name: calzone.calzoneName,
      description: calzone.calzoneDescription,
      basePrice: calzone.basePrice,
      category: calzone.category,
      imageUrl: calzone.imageUrl,
      ingredients: calzone.fillings, // Map fillings back to ingredients for frontend
      isActive: calzone.isActive,
      sortOrder: calzone.sortOrder,
      createdAt: calzone.createdAt,
      updatedAt: calzone.updatedAt,
      sizes: calzone.sizes.map(size => ({
        id: size.id,
        specialtyPizzaId: size.specialtyCalzoneId, // Keep same field name for frontend compatibility
        pizzaSizeId: size.pizzaSizeId,
        price: size.price,
        isAvailable: size.isAvailable,
        createdAt: size.createdAt,
        updatedAt: size.updatedAt,
        pizzaSize: size.pizzaSize
      }))
    }));

    console.log(`✅ Found ${transformedCalzones.length} specialty calzones`);
    return NextResponse.json(transformedCalzones);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching specialty calzones:', {
      message: errorMessage,
      error: error
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch specialty calzones',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
