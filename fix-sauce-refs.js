const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const badSauceId = 'cmeacmwfr0002vkvgg96mul48'; // "origina pizza"
    const goodSauceId = 'cmeafxdoj0003vkzcc66kq3nl'; // "ORIGINAL PIZZA"
    
    console.log('Updating references from bad sauce to good sauce...');
    
    // Check for any order items that reference the bad sauce
    const orderItemsWithBadSauce = await prisma.orderItem.findMany({
      where: { pizzaSauceId: badSauceId }
    });
    console.log(`Found ${orderItemsWithBadSauce.length} order items using bad sauce`);
    
    // Update any order items that reference the bad sauce (if any)
    if (orderItemsWithBadSauce.length > 0) {
      const orderUpdate = await prisma.orderItem.updateMany({
        where: { pizzaSauceId: badSauceId },
        data: { pizzaSauceId: goodSauceId }
      });
      console.log(`Updated ${orderUpdate.count} order items`);
    } else {
      console.log('No order items to update');
    }
    
    // Now try to delete the bad sauce
    await prisma.pizzaSauce.delete({
      where: { id: badSauceId }
    });
    console.log('Deleted bad sauce successfully');
    
    console.log('\n=== FINAL SAUCES ===');
    const finalSauces = await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } });
    finalSauces.forEach(s => console.log(`- ${s.name}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
