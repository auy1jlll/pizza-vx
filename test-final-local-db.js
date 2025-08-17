const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Local PostgreSQL Database...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Get counts
    const specialtyCount = await prisma.specialty_pizzas.count();
    const sizesCount = await prisma.pizza_sizes.count();
    const toppingsCount = await prisma.pizza_toppings.count();
    
    console.log('\n📊 Database Contents:');
    console.log(`🍕 Specialty Pizzas: ${specialtyCount}`);
    console.log(`📏 Pizza Sizes: ${sizesCount}`);
    console.log(`🥬 Toppings: ${toppingsCount}`);
    
    // Test specialty pizzas
    const pizzas = await prisma.specialty_pizzas.findMany({
      select: { name: true, category: true }
    });
    
    console.log('\n🍕 Available Specialty Pizzas:');
    pizzas.forEach(pizza => {
      console.log(`  • ${pizza.name} (${pizza.category})`);
    });
    
    console.log('\n🎉 LOCAL DATABASE CONNECTION SUCCESS!');
    console.log('💻 Your app is now using the local PostgreSQL database');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
