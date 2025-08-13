const { PrismaClient } = require('@prisma/client');

async function checkSizes() {
  const prisma = new PrismaClient();
  try {
    const sizes = await prisma.pizzaSize.findMany();
    console.log('Existing pizza sizes:');
    sizes.forEach(s => console.log(`- Name: "${s.name}", Diameter: "${s.diameter}"`));
    console.log(`Total: ${sizes.length} sizes`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSizes();
