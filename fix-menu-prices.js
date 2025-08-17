const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPrices() {
  console.log('🔧 Fixing Menu Item Prices...\n');
  
  try {
    // Update menu items with proper prices
    const updates = [
      { name: 'Italian Sub', price: 8.99 },
      { name: 'Chicken Parmesan Sub', price: 9.99 },
      { name: 'Turkey Club', price: 9.99 },
      { name: 'Chef Salad', price: 7.99 },
      { name: 'Caesar Salad', price: 6.99 },
      { name: 'Garden Salad', price: 5.99 },
      { name: 'Shrimp Scampi', price: 16.99 },
      { name: 'Atlantic Salmon', price: 18.99 },
      { name: 'Fish and Chips', price: 12.99 },
      { name: 'Grilled Chicken Dinner', price: 13.99 },
      { name: 'BBQ Ribs Dinner', price: 19.99 },
      { name: 'Meatloaf Dinner', price: 11.99 }
    ];
    
    for (const item of updates) {
      const result = await prisma.menuItem.updateMany({
        where: { name: item.name },
        data: { basePrice: item.price }
      });
      console.log(`✅ Updated ${item.name} basePrice to $${item.price} (${result.count} records)`);
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updated prices:');
    const allItems = await prisma.menuItem.findMany({
      include: { category: true }
    });
    
    allItems.forEach(item => {
      console.log(`   - ${item.name}: $${item.basePrice} (${item.category.name})`);
    });
    
    console.log('\n🎉 All prices updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating prices:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixPrices();
