const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCalzoneSizeNames() {
  try {
    console.log('=== CURRENT CALZONE SIZE NAMES ===');
    const sizes = await prisma.pizzaSize.findMany({
      where: {
        name: {
          contains: 'Calzone'
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    sizes.forEach(s => {
      console.log(`ID: ${s.id}`);
      console.log(`Name: "${s.name}"`);
      console.log(`Diameter: "${s.diameter}"`);
      console.log(`---`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkCalzoneSizeNames();
