import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Fetching all specialty pizzas from production database...');

    const allSpecialtyPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`✅ [DEBUG] Found ${allSpecialtyPizzas.length} specialty pizzas`);

    const result = allSpecialtyPizzas.map((pizza, index) => ({
      arrayIndex: index,
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      sortOrder: pizza.sortOrder,
      isActive: pizza.isActive
    }));

    return NextResponse.json({
      message: `Found ${allSpecialtyPizzas.length} specialty pizzas in production database`,
      pizzas: result,
      indexMapping: {
        0: allSpecialtyPizzas[0]?.name || 'N/A',
        1: allSpecialtyPizzas[1]?.name || 'N/A', 
        2: allSpecialtyPizzas[2]?.name || 'N/A',
        3: allSpecialtyPizzas[3]?.name || 'N/A',
        4: allSpecialtyPizzas[4]?.name || 'N/A',
      },
      debug: {
        index2Details: allSpecialtyPizzas[2] ? {
          id: allSpecialtyPizzas[2].id,
          name: allSpecialtyPizzas[2].name,
          sortOrder: allSpecialtyPizzas[2].sortOrder
        } : null
      }
    });

  } catch (error) {
    console.error('❌ [DEBUG] Error fetching specialty pizzas:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
