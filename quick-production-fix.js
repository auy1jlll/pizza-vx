const { PrismaClient } = require('@prisma/client');

async function quickProductionFix() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Quick Production Specialty Pizza Fix');
    
    // Clear old garbage data
    await prisma.specialtyPizzaSize.deleteMany({});
    await prisma.specialtyPizza.deleteMany({});
    
    // Get or create pizza sizes
    let sizes = await prisma.pizzaSize.findMany();
    if (sizes.length === 0) {
      await prisma.pizzaSize.createMany({
        data: [
          { name: 'Small', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 1 },
          { name: 'Medium', diameter: '12"', basePrice: 15.99, isActive: true, sortOrder: 2 },
          { name: 'Large', diameter: '14"', basePrice: 18.99, isActive: true, sortOrder: 3 }
        ]
      });
      sizes = await prisma.pizzaSize.findMany();
    }
    
    // Create proper specialty pizzas
    const pizzas = [
      { name: 'Chicken Alfredo', description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses', basePrice: 15.45 },
      { name: 'BBQ Chicken', description: 'Chicken, Onion and Bacon with lots of BBQ sauce', basePrice: 16.50 },
      { name: 'House Special', description: 'Pepperoni, Italian Sausage, Mushrooms, Green Peppers, and Onions', basePrice: 17.99 },
      { name: 'Meat Lovers', description: 'Pepperoni, Italian Sausage, Ham, and Bacon', basePrice: 18.99 },
      { name: 'Veggie Supreme', description: 'Mushrooms, Green Peppers, Onions, Black Olives, and Tomatoes', basePrice: 16.99 },
      { name: 'Hawaiian', description: 'Ham and Pineapple on our signature pizza sauce', basePrice: 15.99 }
    ];
    
    for (const pizzaData of pizzas) {
      const pizza = await prisma.specialtyPizza.create({
        data: {
          ...pizzaData,
          isActive: true,
          category: 'Premium'
        }
      });
      
      // Add sizes for each pizza
      for (const size of sizes) {
        const price = size.name === 'Small' ? 14.99 : size.name === 'Medium' ? 18.99 : 22.99;
        await prisma.specialtyPizzaSize.create({
          data: {
            specialtyPizzaId: pizza.id,
            pizzaSizeId: size.id,
            price: price,
            isAvailable: true
          }
        });
      }
      console.log(`✅ Created ${pizza.name} with ${sizes.length} sizes`);
    }
    
    console.log('🎉 Production fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickProductionFix();
