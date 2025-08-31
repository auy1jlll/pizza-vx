import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log(`📥 Fetching specialty calzone with ID: ${id}`);

    const specialtyCalzone = await prisma.specialtyCalzone.findUnique({
      where: {
        id: id,
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
      }
    });

    if (!specialtyCalzone) {
      console.log(`❌ Specialty calzone not found: ${id}`);
      return NextResponse.json(
        { error: 'Specialty calzone not found' },
        { status: 404 }
      );
    }

    // Get all available pizza components for the calzone builder
    const [crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaCrust.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaSauce.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaTopping.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
    ]);

    // Parse the fillings from the specialty calzone (could be JSON string or array)
    let ingredientNames: string[] = [];
    if (typeof specialtyCalzone.fillings === 'string') {
      try {
        // Try to parse as JSON first
        ingredientNames = JSON.parse(specialtyCalzone.fillings);
      } catch {
        // If not JSON, treat as comma-separated string
        ingredientNames = specialtyCalzone.fillings.split(',').map(f => f.trim());
      }
    } else if (Array.isArray(specialtyCalzone.fillings)) {
      ingredientNames = specialtyCalzone.fillings;
    }

    // Find the matching toppings for the specialty calzone ingredients
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
    const defaultSize = specialtyCalzone.sizes.find((s: any) => s.pizzaSize.sortOrder === 2) || 
                      specialtyCalzone.sizes[1] || 
                      specialtyCalzone.sizes[0];

    const defaultConfiguration = {
      defaultSizeId: defaultSize?.pizzaSize.id || '',
      defaultCrustId: crusts.find(c => c.sortOrder === 1)?.id || crusts[0]?.id || '',
      defaultSauceId: sauces.find(s => s.sortOrder === 1)?.id || sauces[0]?.id || '',
      sauceIntensity: 'REGULAR' as const,
      crustCookingLevel: 'REGULAR' as const,
      toppings: specialtyToppings,
      availableSizes: specialtyCalzone.sizes.map((s: any) => ({
        id: s.pizzaSize.id,
        name: s.pizzaSize.name,
        diameter: s.pizzaSize.diameter,
        price: s.price
      }))
    };

    const transformedCalzone = {
      id: specialtyCalzone.id,
      name: specialtyCalzone.calzoneName,
      description: specialtyCalzone.calzoneDescription,
      category: specialtyCalzone.category,
      basePrice: specialtyCalzone.basePrice,
      ...defaultConfiguration
    };

    console.log(`✅ Found specialty calzone: ${specialtyCalzone.calzoneName}`);

    return NextResponse.json(transformedCalzone);

  } catch (error) {
    console.error('❌ Error fetching specialty calzone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
