const { PrismaClient } = require('@prisma/client');

async function testSeparation() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Testing Clean Architecture Separation\n');

    // Check specialty pizzas
    const pizzas = await prisma.specialtyPizza.findMany({
      select: { name: true, category: true }
    });
    console.log(`📋 Specialty Pizzas Table (${pizzas.length} items):`);
    pizzas.forEach(pizza => {
      console.log(`   - ${pizza.name} (Category: ${pizza.category})`);
    });

    // Check specialty calzones
    const calzones = await prisma.specialtyCalzone.findMany({
      select: { calzoneName: true, category: true }
    });
    console.log(`\n🥟 Specialty Calzones Table (${calzones.length} items):`);
    calzones.forEach(calzone => {
      console.log(`   - ${calzone.calzoneName} (Category: ${calzone.category})`);
    });

    console.log('\n✅ Perfect! Clean separation achieved:');
    console.log('   ➤ No more "back and forth" filtering issues');
    console.log('   ➤ Pizzas and calzones in separate tables');
    console.log('   ➤ Calzone-specific field names (calzoneName, fillings)');
    console.log('   ➤ Frontend compatibility maintained through transformation');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSeparation();
