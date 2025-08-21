const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPrices() {
  try {
    console.log('Starting price format standardization...');
    
    // Get all menu items
    const items = await prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        basePrice: true
      }
    });
    
    console.log(`Found ${items.length} menu items to check`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const item of items) {
      // If price is less than 100, it's likely stored in dollars and needs conversion
      if (item.basePrice < 100) {
        const newPrice = Math.round(item.basePrice * 100);
        await prisma.menuItem.update({
          where: { id: item.id },
          data: { basePrice: newPrice }
        });
        console.log(`${item.name}: ${item.basePrice} -> ${newPrice} (converted)`);
        updated++;
      } else {
        console.log(`${item.name}: ${item.basePrice} (already in cents, skipped)`);
        skipped++;
      }
    }
    
    console.log(`\nComplete! Updated ${updated} items, skipped ${skipped} items`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPrices();
