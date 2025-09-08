import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`🔍 [TEST-PIZZA] Fetching specialty pizza with ID/Index: ${id}`);

    let specialtyPizza = null;

    // First try to find by ID (UUID)
    if (id.length > 10) { // Rough check for UUID vs numeric index
      console.log(`🔍 [TEST-PIZZA] Trying UUID lookup for: ${id}`);
      specialtyPizza = await prisma.specialtyPizza.findUnique({
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
    }

    // If not found by ID or if it's a numeric index, try to get by array position
    if (!specialtyPizza) {
      const numericIndex = parseInt(id);
      if (!isNaN(numericIndex)) {
        console.log(`🔍 [TEST-PIZZA] Fetching specialty pizza by index: ${numericIndex}`);
        
        // Get all specialty pizzas ordered by sortOrder
        const allSpecialtyPizzas = await prisma.specialtyPizza.findMany({
          where: { isActive: true },
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
          orderBy: { sortOrder: 'asc' }
        });

        console.log(`🔍 [TEST-PIZZA] Found ${allSpecialtyPizzas.length} total specialty pizzas`);

        if (numericIndex >= 0 && numericIndex < allSpecialtyPizzas.length) {
          specialtyPizza = allSpecialtyPizzas[numericIndex];
          console.log(`✅ [TEST-PIZZA] Found specialty pizza by index ${numericIndex}: ${specialtyPizza.name}`);
        } else {
          console.log(`❌ [TEST-PIZZA] Index ${numericIndex} out of range (0-${allSpecialtyPizzas.length - 1})`);
        }
      }
    }

    if (!specialtyPizza) {
      console.log(`❌ [TEST-PIZZA] Specialty pizza not found: ${id}`);
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
      console.error('[TEST-PIZZA] Error parsing specialty pizza ingredients:', error);
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
      ...defaultConfiguration,
      _debug: {
        requestedId: id,
        foundByMethod: id.length > 10 ? 'UUID' : 'INDEX',
        ingredientsParsed: ingredientNames,
        toppingsMatched: specialtyToppings.length
      }
    };

    console.log(`✅ [TEST-PIZZA] Returning transformed pizza: ${specialtyPizza.name}`);

    return NextResponse.json(transformedPizza);
  } catch (error) {
    console.error('❌ [TEST-PIZZA] Error fetching specialty pizza:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
