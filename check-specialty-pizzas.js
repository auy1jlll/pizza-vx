const { PrismaClient } = require('@prisma/client');

async function checkSpecialtyPizzas() {
  const prisma = new PrismaClient();
  
  try {
    const pizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('=== LOCAL DATABASE ===');
    console.log('Found', pizzas.length, 'specialty pizzas');
    
    pizzas.forEach((p, i) => {
      console.log(`Index ${i}: "${p.name}" (sortOrder: ${p.sortOrder}, id: ${p.id})`);
    });
    
    if (pizzas.length >= 3) {
      console.log('\n=== CHECKING INDEX 2 ===');
      console.log(`Pizza at index 2: "${pizzas[2].name}"`);
      console.log(`ID: ${pizzas[2].id}`);
      console.log(`Sort Order: ${pizzas[2].sortOrder}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecialtyPizzas();
