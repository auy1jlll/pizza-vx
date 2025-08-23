const { PrismaClient } = require('@prisma/client');

async function quickCheck() {
  const prisma = new PrismaClient();
  try {
    const items = await prisma.specialtyPizza.findMany();
    console.log(`Found ${items.length} specialty items:`);
    items.forEach(item => {
      console.log(`- ${item.name} (Category: ${item.category})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickCheck();
