const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkExistingIds() {
  console.log('🔍 Checking existing pizza component IDs...');
  
  try {
    const sizes = await prisma.pizzaSize.findMany();
    console.log('📏 Available sizes:', sizes.map(s => `${s.id} (${s.name})`));
    
    const crusts = await prisma.pizzaCrust.findMany();
    console.log('🍞 Available crusts:', crusts.map(c => `${c.id} (${c.name})`));
    
    const sauces = await prisma.pizzaSauce.findMany();
    console.log('🍅 Available sauces:', sauces.map(s => `${s.id} (${s.name})`));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingIds();
