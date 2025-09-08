import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🍕 Fetching specialty pizzas for test page...');
    
    // Query the database for specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        category: true,
        ingredients: true,
        sortOrder: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    console.log(`✅ Found ${specialtyPizzas.length} specialty pizzas for test`);
    
    return NextResponse.json({
      success: true,
      count: specialtyPizzas.length,
      data: specialtyPizzas
    });
    
  } catch (error) {
    console.error('❌ Error fetching specialty pizzas for test:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch specialty pizzas',
        count: 0,
        data: []
      },
      { status: 500 }
    );
  }
}
