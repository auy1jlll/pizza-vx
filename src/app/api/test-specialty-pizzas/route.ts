import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST] Fetching all specialty pizzas from production database...');

    // Get all specialty pizzas ordered by sortOrder
    const allSpecialtyPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
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
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`✅ [TEST] Found ${allSpecialtyPizzas.length} specialty pizzas`);

    const result = allSpecialtyPizzas.map((pizza, index) => ({
      arrayIndex: index,
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      sortOrder: pizza.sortOrder,
      sizesCount: pizza.sizes.length,
      isActive: pizza.isActive
    }));

    return NextResponse.json({
      message: `Found ${allSpecialtyPizzas.length} specialty pizzas`,
      pizzas: result,
      indexMapping: {
        0: allSpecialtyPizzas[0]?.name || 'N/A',
        1: allSpecialtyPizzas[1]?.name || 'N/A', 
        2: allSpecialtyPizzas[2]?.name || 'N/A',
        3: allSpecialtyPizzas[3]?.name || 'N/A',
        4: allSpecialtyPizzas[4]?.name || 'N/A',
      }
    });

  } catch (error) {
    console.error('❌ [TEST] Error fetching specialty pizzas:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
