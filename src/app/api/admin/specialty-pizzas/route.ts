import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    // Parse ingredients JSON for each pizza
    const formattedPizzas = specialtyPizzas.map(pizza => ({
      ...pizza,
      ingredients: pizza.ingredients ? JSON.parse(pizza.ingredients) : []
    }));

    return NextResponse.json(formattedPizzas);
  } catch (error) {
    console.error('Error fetching specialty pizzas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, basePrice, category, imageUrl, ingredients, toppings, isActive, sizePricing } = body;

    if (!name || !description || basePrice === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Combine ingredients and topping names for storage
    const allIngredients = [...(ingredients || [])];
    if (toppings && toppings.length > 0) {
      // Get topping names from the database
      const selectedToppings = await prisma.pizzaTopping.findMany({
        where: { id: { in: toppings } },
        select: { name: true }
      });
      allIngredients.push(...selectedToppings.map((t: { name: string }) => t.name));
    }

    const specialtyPizza = await prisma.specialtyPizza.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        category,
        imageUrl: imageUrl || null,
        ingredients: JSON.stringify(allIngredients),
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Create size pricing relationships if provided
    if (sizePricing) {
      const sizeEntries = Object.entries(sizePricing as Record<string, { price: number, isAvailable: boolean }>);
      for (const [sizeId, pricing] of sizeEntries) {
        if (pricing.isAvailable && pricing.price > 0) {
          await prisma.specialtyPizzaSize.create({
            data: {
              specialtyPizzaId: specialtyPizza.id,
              pizzaSizeId: sizeId,
              price: pricing.price,
              isAvailable: pricing.isAvailable
            }
          });
        }
      }
    }

    // Parse ingredients for response
    const formattedPizza = {
      ...specialtyPizza,
      ingredients: JSON.parse(specialtyPizza.ingredients)
    };

    return NextResponse.json(formattedPizza, { status: 201 });
  } catch (error) {
    console.error('Error creating specialty pizza:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
