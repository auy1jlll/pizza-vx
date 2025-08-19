const { PrismaClient } = require('@prisma/client');

async function debugCartIssues() {
  const prisma = new PrismaClient();
  
  try {
    console.log('\n🛒 DEBUGGING CART/ORDER ISSUES');
    console.log('============================\n');
    
    // Check recent orders or cart items
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
            customizations: true
          }
        }
      }
    });
    
    console.log(`Found ${recentOrders.length} recent orders:\n`);
    
    recentOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.id} - $${order.total}`);
      order.items.forEach(item => {
        console.log(`   - ${item.quantity}x ${item.menuItem?.name || 'UNKNOWN ITEM'} ($${item.price})`);
        if (item.notes) {
          console.log(`     Notes: ${item.notes.substring(0, 100)}...`);
        }
      });
      console.log('');
    });
    
    // Check if there are items with wrong category mapping
    console.log('\n🔍 CHECKING FOR CATEGORY MAPPING ISSUES:');
    
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    });
    
    console.log('Categories and item counts:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}): ${cat._count.menuItems} items`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugCartIssues();
