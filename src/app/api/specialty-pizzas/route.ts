import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📥 Fetching specialty pizzas...');
    
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
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
        category: 'asc'
      }
    });

    console.log(`✅ Found ${specialtyPizzas.length} specialty pizzas`);
    return NextResponse.json(specialtyPizzas);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching specialty pizzas:', {
      message: errorMessage,
      error: error
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch specialty pizzas',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
