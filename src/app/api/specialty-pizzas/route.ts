import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
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

    return NextResponse.json(specialtyPizzas);
  } catch (error) {
    console.error('Error fetching specialty pizzas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialty pizzas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
