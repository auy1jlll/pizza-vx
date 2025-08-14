const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSpecialtyPizzaSizes() {
  try {
    console.log('🍕 Seeding specialty pizza sizes...');

    // First, ensure we have proper pizza sizes
    await prisma.pizzaSize.upsert({
      where: { name: 'Small' },
      update: { basePrice: 9.99, diameter: "10\"", description: 'Perfect for one person' },
      create: { 
        name: 'Small', 
        basePrice: 9.99, 
        diameter: "10\"", 
        description: 'Perfect for one person',
        isActive: true,
        sortOrder: 1
      }
    });

    await prisma.pizzaSize.upsert({
      where: { name: 'Medium' },
      update: { basePrice: 13.99, diameter: "12\"", description: 'Great for sharing' },
      create: { 
        name: 'Medium', 
        basePrice: 13.99, 
        diameter: "12\"", 
        description: 'Great for sharing',
        isActive: true,
        sortOrder: 2
      }
    });

    await prisma.pizzaSize.upsert({
      where: { name: 'Large' },
      update: { basePrice: 16.99, diameter: "14\"", description: 'Family size pizza' },
      create: { 
        name: 'Large', 
        basePrice: 16.99, 
        diameter: "14\"", 
        description: 'Family size pizza',
        isActive: true,
        sortOrder: 3
      }
    });

    console.log('✅ Pizza sizes ensured');

    // Get all specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany();
    console.log(`Found ${specialtyPizzas.length} specialty pizzas`);

    // Get all pizza sizes
    const pizzaSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`Found ${pizzaSizes.length} pizza sizes`);

    if (specialtyPizzas.length === 0 || pizzaSizes.length === 0) {
      console.log('❌ No specialty pizzas or sizes found. Please run the main seed first.');
      return;
    }

    // Create specialty pizza sizes for each combination
    for (const specialtyPizza of specialtyPizzas) {
      for (const size of pizzaSizes) {
        // Set realistic prices based on size and pizza category
        let price;
        
        // Different pricing tiers based on specialty pizza type
        const isPremium = specialtyPizza.category === 'PREMIUM' || 
                         specialtyPizza.category === 'MEAT_LOVERS' ||
                         specialtyPizza.name.includes('Deluxe') ||
                         specialtyPizza.name.includes('Supreme');
        
        switch (size.name) {
          case 'Small':
            price = isPremium ? 14.99 : 12.99;
            break;
          case 'Medium':
            price = isPremium ? 18.99 : 16.99;
            break;
          case 'Large':
            price = isPremium ? 22.99 : 19.99;
            break;
          default:
            price = 16.99; // fallback price
        }

        await prisma.specialtyPizzaSize.upsert({
          where: {
            specialtyPizzaId_pizzaSizeId: {
              specialtyPizzaId: specialtyPizza.id,
              pizzaSizeId: size.id
            }
          },
          update: {
            price: price,
            isAvailable: true
          },
          create: {
            specialtyPizzaId: specialtyPizza.id,
            pizzaSizeId: size.id,
            price: price,
            isAvailable: true
          }
        });

        console.log(`✅ Created size option: ${specialtyPizza.name} - ${size.name} ($${price})`);
      }
    }

    console.log('🎉 Specialty pizza sizes seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding specialty pizza sizes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSpecialtyPizzaSizes();
