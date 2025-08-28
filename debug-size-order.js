const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpecialtyPizzaSizeOrder() {
  try {
    console.log('=== CHECKING SPECIALTY PIZZA SIZE ORDER ===');
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          where: { isAvailable: true },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      take: 2 // Just check first 2 pizzas
    });
    
    specialtyPizzas.forEach(pizza => {
      console.log(`\n${pizza.name}:`);
      pizza.sizes.forEach((size, index) => {
        console.log(`  [${index}] ${size.pizzaSize.name} (${size.pizzaSize.diameter}) - Sort: ${size.pizzaSize.sortOrder} - Price: $${size.price}`);
      });
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSpecialtyPizzaSizeOrder();
