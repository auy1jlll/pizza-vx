const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCalzones() {
  try {
    const calzones = await prisma.specialtyPizza.findMany({
      where: { category: 'CALZONE' },
      include: {
        sizes: {
          include: { pizzaSize: true }
        }
      },
      take: 1 // Just get one example
    });
    
    console.log('=== CALZONE WITH SIZES ===');
    if (calzones.length > 0) {
      const calzone = calzones[0];
      console.log(`Name: ${calzone.name}`);
      console.log(`Base Price: $${calzone.basePrice}`);
      console.log('Available Sizes:');
      calzone.sizes.forEach(size => {
        console.log(`  - ${size.pizzaSize.name}: $${size.price} (Pizza Size Type: ${size.pizzaSize.productType})`);
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkCalzones();
