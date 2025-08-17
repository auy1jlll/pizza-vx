import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const specialtyPizza = await prisma.specialtyPizza.findUnique({
      where: { id },
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
      }
    });

    if (!specialtyPizza) {
      return NextResponse.json(
        { error: 'Specialty pizza not found' },
        { status: 404 }
      );
    }

    // Get all available pizza components for the pizza builder
    const [crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaCrust.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaSauce.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaTopping.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
    ]);

    // Parse the ingredients from the specialty pizza (JSON string)
    let ingredientNames: string[] = [];
    try {
      ingredientNames = JSON.parse(specialtyPizza.ingredients || '[]');
    } catch (error) {
      console.error('Error parsing specialty pizza ingredients:', error);
    }

    // Find the matching toppings for the specialty pizza ingredients
    const specialtyToppings = ingredientNames.map(ingredientName => {
      const topping = toppings.find(t => 
        t.name.toLowerCase() === ingredientName.toLowerCase() ||
        t.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
        ingredientName.toLowerCase().includes(t.name.toLowerCase())
      );
      return topping ? {
        toppingId: topping.id,
        section: 'WHOLE' as const,
        intensity: 'REGULAR' as const
      } : null;
    }).filter(Boolean);

    // Get the default size (use sort order - typically position 2 is medium)
    const defaultSize = specialtyPizza.sizes.find((s: any) => s.pizzaSize.sortOrder === 2) || 
                      specialtyPizza.sizes[1] || 
                      specialtyPizza.sizes[0];

    const defaultConfiguration = {
      defaultSizeId: defaultSize?.pizzaSize.id || '',
      defaultCrustId: crusts.find(c => c.sortOrder === 1)?.id || crusts[0]?.id || '',
      defaultSauceId: sauces.find(s => s.sortOrder === 1)?.id || sauces[0]?.id || '',
      sauceIntensity: 'REGULAR' as const,
      crustCookingLevel: 'REGULAR' as const,
      toppings: specialtyToppings,
      availableSizes: specialtyPizza.sizes.map((s: any) => ({
        id: s.pizzaSize.id,
        name: s.pizzaSize.name,
        diameter: s.pizzaSize.diameter,
        price: s.price
      }))
    };

    const transformedPizza = {
      id: specialtyPizza.id,
      name: specialtyPizza.name,
      description: specialtyPizza.description,
      category: specialtyPizza.category,
      basePrice: specialtyPizza.basePrice,
      ...defaultConfiguration
    };

    return NextResponse.json(transformedPizza);
  } catch (error) {
    console.error('Error fetching specialty pizza:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
