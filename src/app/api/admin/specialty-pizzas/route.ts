import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const specialtyPizzas = await prisma.specialtyPizza.findMany({
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
    const { name, description, basePrice, category, imageUrl, ingredients, isActive } = body;

    if (!name || !description || basePrice === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const specialtyPizza = await prisma.specialtyPizza.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        category,
        imageUrl: imageUrl || null,
        ingredients: JSON.stringify(ingredients || []),
        isActive: isActive !== undefined ? isActive : true
      }
    });

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
