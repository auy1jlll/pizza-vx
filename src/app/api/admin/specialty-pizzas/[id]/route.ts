import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, basePrice, category, imageUrl, ingredients, isActive, sizePricing } = body;

    if (!name || !description || basePrice === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const specialtyPizza = await prisma.specialtyPizza.update({
      where: { id },
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

    // Update size pricing relationships if provided
    if (sizePricing) {
      // First, delete existing size relationships
      await prisma.specialtyPizzaSize.deleteMany({
        where: { specialtyPizzaId: id }
      });

      // Then create new ones
      const sizeEntries = Object.entries(sizePricing as Record<string, { price: number, isAvailable: boolean }>);
      for (const [sizeId, pricing] of sizeEntries) {
        if (pricing.isAvailable && pricing.price > 0) {
          await prisma.specialtyPizzaSize.create({
            data: {
              specialtyPizzaId: id,
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

    return NextResponse.json(formattedPizza);
  } catch (error: any) {
    console.error('Error updating specialty pizza:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Specialty pizza not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.specialtyPizza.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Specialty pizza deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting specialty pizza:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Specialty pizza not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
