const { PrismaClient } = require('@prisma/client');

async function testLocalDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing LOCAL Database Connection...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test data retrieval
    const specialtyPizzas = await prisma.specialty_pizzas.count();
    const pizzaSizes = await prisma.pizza_sizes.count();
    const toppings = await prisma.pizza_toppings.count();
    
    console.log('\n📊 Database Data Summary:');
    console.log(`🍕 Specialty Pizzas: ${specialtyPizzas}`);
    console.log(`📏 Pizza Sizes: ${pizzaSizes}`);
    console.log(`🥬 Toppings: ${toppings}`);
    
    // Test a specific query
    const activePizzas = await prisma.specialty_pizzas.findMany({
      where: { isActive: true },
      select: { name: true, category: true }
    });
    
    console.log('\n🍕 Active Specialty Pizzas:');
    activePizzas.forEach(pizza => {
      console.log(`  • ${pizza.name} (${pizza.category})`);
    });
    
    console.log('\n🎉 LOCAL DATABASE CONNECTION TEST PASSED!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Troubleshooting: Password authentication failed');
      console.log('   This might be a PostgreSQL authentication method issue');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testLocalDatabase();
