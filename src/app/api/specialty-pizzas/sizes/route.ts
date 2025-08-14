import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
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
        },
        components: {
          include: {
            pizzaTopping: true
          }
        }
      },
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json(specialtyPizzas);
  } catch (error) {
    console.error('Error fetching specialty pizzas with sizes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialty pizzas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { specialtyPizzaId, pizzaSizeId, price, isAvailable = true } = await request.json();

    const specialtyPizzaSize = await prisma.specialtyPizzaSize.upsert({
      where: {
        specialtyPizzaId_pizzaSizeId: {
          specialtyPizzaId,
          pizzaSizeId
        }
      },
      update: {
        price,
        isAvailable
      },
      create: {
        specialtyPizzaId,
        pizzaSizeId,
        price,
        isAvailable
      },
      include: {
        specialtyPizza: true,
        pizzaSize: true
      }
    });

    return NextResponse.json(specialtyPizzaSize);
  } catch (error) {
    console.error('Error creating/updating specialty pizza size:', error);
    return NextResponse.json(
      { error: 'Failed to create/update specialty pizza size' },
      { status: 500 }
    );
  }
}
