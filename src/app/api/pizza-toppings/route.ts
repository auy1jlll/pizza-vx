import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pizzaToppings = await prisma.pizzaTopping.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(pizzaToppings);
  } catch (error) {
    console.error('Error fetching pizza toppings:', error);
    return NextResponse.json({ error: 'Failed to fetch pizza toppings' }, { status: 500 });
  }
}