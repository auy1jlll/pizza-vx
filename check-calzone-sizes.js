const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCalzoneSizes() {
  try {
    console.log('=== PIZZA SIZES (ALL) ===');
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    allSizes.forEach(s => {
      console.log(`${s.name} (${s.diameter}): $${s.basePrice} - Active: ${s.isActive}`);
    });
    
    console.log('\n=== SPECIALTY CALZONE DATA ===');
    const calzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      take: 1
    });
    
    if (calzones.length > 0) {
      const calzone = calzones[0];
      console.log(`Calzone: ${calzone.calzoneName}`);
      console.log('Available sizes:');
      calzone.sizes.forEach(s => {
        console.log(`  ${s.pizzaSize.name} (${s.pizzaSize.diameter}): $${s.price}`);
      });
    } else {
      console.log('No specialty calzones found');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkCalzoneSizes();
