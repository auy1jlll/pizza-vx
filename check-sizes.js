const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSizes() {
  try {
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('=== ALL SIZES IN DATABASE ===');
    allSizes.forEach(size => {
      console.log(`${size.name} - ${size.diameter} - $${size.basePrice} - Type: ${size.productType || 'NULL'} - Active: ${size.isActive}`);
    });
    
    const calzoneSizes = allSizes.filter(size => size.productType === 'CALZONE');
    console.log(`\n=== CALZONE SIZES: ${calzoneSizes.length} found ===`);
    
    const pizzaSizes = allSizes.filter(size => size.productType === 'PIZZA' || !size.productType);
    console.log(`=== PIZZA SIZES: ${pizzaSizes.length} found ===`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSizes();
