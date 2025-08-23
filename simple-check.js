const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic query
    const count = await prisma.specialtyPizza.count();
    console.log(`Total specialty pizzas: ${count}`);
    
    if (count > 0) {
      const firstPizza = await prisma.specialtyPizza.findFirst();
      console.log('First pizza:', firstPizza);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
