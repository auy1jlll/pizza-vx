const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSizes() {
  try {
    console.log('=== PIZZA SIZES ===');
    const sizes = await prisma.pizzaSize.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    sizes.forEach(s => {
      console.log(`${s.name} (${s.diameter}): $${s.basePrice}`);
    });
    
    console.log('\n=== SPECIALTY PIZZA SIZES ===');
    const specialtySizes = await prisma.specialtyPizzaSize.findMany({
      include: {
        specialtyPizza: { select: { name: true } },
        pizzaSize: { select: { name: true, diameter: true } }
      },
      where: { isAvailable: true },
      orderBy: [
        { specialtyPizza: { name: 'asc' } },
        { pizzaSize: { sortOrder: 'asc' } }
      ]
    });
    
    let currentPizza = '';
    specialtySizes.forEach(s => {
      if (s.specialtyPizza.name !== currentPizza) {
        currentPizza = s.specialtyPizza.name;
        console.log(`\n${currentPizza}:`);
      }
      console.log(`  ${s.pizzaSize.name} (${s.pizzaSize.diameter}): $${s.price}`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSizes();
