const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('=== ALL PIZZA SIZES ===');
    const sizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    if (sizes.length === 0) {
      console.log('No sizes found');
    } else {
      sizes.forEach(size => {
        console.log(`${size.id}: "${size.name}" - ${size.description} - Sort: ${size.sortOrder}`);
      });
    }
    
    console.log('\n=== SPECIALTY PIZZA SIZES FOR cmeawfum10000vky8ky7a97km ===');
    const specialtyPizzaSizes = await prisma.specialtyPizzaSize.findMany({
      where: {
        specialtyPizzaId: 'cmeawfum10000vky8ky7a97km'
      },
      include: {
        pizzaSize: true
      }
    });
    
    if (specialtyPizzaSizes.length === 0) {
      console.log('No specialty pizza sizes found');
    } else {
      specialtyPizzaSizes.forEach(sps => {
        console.log(`${sps.pizzaSize.id}: "${sps.pizzaSize.name}" - ${sps.pizzaSize.description} - Price: $${sps.price}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
