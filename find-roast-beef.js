const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findRoastBeef() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { name: { contains: 'Roast Beef' } },
      include: { category: true }
    });
    
    console.log('Roast Beef items:');
    items.forEach(item => {
      console.log(`- ${item.name} (ID: ${item.id}) - Category: ${item.category.name} (ID: ${item.categoryId})`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

findRoastBeef();
