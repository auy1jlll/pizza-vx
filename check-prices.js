const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPrices() {
  try {
    const items = await prisma.menuItem.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        basePrice: true,
        category: {
          select: { name: true }
        }
      }
    });
    
    console.log('Menu Items and their prices:');
    console.log('==================================');
    items.forEach(item => {
      console.log(`${item.name}: ${item.basePrice} (raw) -> $${(item.basePrice / 100).toFixed(2)} (if cents) -> $${item.basePrice.toFixed(2)} (if dollars)`);
    });
    
    // Check specific roast beef item
    const roastBeef = await prisma.menuItem.findFirst({
      where: { name: { contains: 'Roast Beef' } },
      select: { name: true, basePrice: true }
    });
    
    if (roastBeef) {
      console.log('\nRoast Beef Item:');
      console.log(`${roastBeef.name}: ${roastBeef.basePrice} (raw)`);
      console.log(`As cents: $${(roastBeef.basePrice / 100).toFixed(2)}`);
      console.log(`As dollars: $${roastBeef.basePrice.toFixed(2)}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrices();
