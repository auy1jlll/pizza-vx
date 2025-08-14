const { PrismaClient } = require('@prisma/client');

async function listSizes() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 Current Pizza Sizes:');
    console.log('======================');

    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n🍕 ALL SIZES:');
    allSizes.forEach((size, index) => {
      const status = size.isActive ? '✅ Active' : '❌ Inactive';
      console.log(`  ${index + 1}. ${size.name} (${size.diameter}") - $${size.basePrice} - ${status}`);
    });

    const activeSizes = allSizes.filter(s => s.isActive);
    console.log(`\n📊 Summary: ${activeSizes.length} active, ${allSizes.length - activeSizes.length} inactive`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listSizes();
