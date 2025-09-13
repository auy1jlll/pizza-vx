const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function createBackup() {
  const prisma = new PrismaClient();
  console.log('🔄 Creating database backup...');
  
  try {
    // Get all critical data
    const backup = {
      timestamp: new Date().toISOString(),
      users: await prisma.user.findMany(),
      orders: await prisma.order.findMany({ include: { orderItems: true } }),
      menuItems: await prisma.menuItem.findMany(),
      categories: await prisma.menuCategory.findMany(),
      pizzaSizes: await prisma.pizzaSize.findMany(),
      pizzaCrusts: await prisma.pizzaCrust.findMany(),
      pizzaSauces: await prisma.pizzaSauce.findMany(),
      toppings: await prisma.pizzaTopping.findMany(),
      appSettings: await prisma.appSetting.findMany(),
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + Date.now();
    const filename = `database-backup-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup created: ${filename}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - Users: ${backup.users.length}`);
    console.log(`   - Orders: ${backup.orders.length}`);
    console.log(`   - Menu Items: ${backup.menuItems.length}`);
    console.log(`   - Categories: ${backup.categories.length}`);
    console.log(`   - Pizza Sizes: ${backup.pizzaSizes.length}`);
    console.log(`   - Pizza Crusts: ${backup.pizzaCrusts.length}`);
    console.log(`   - Pizza Sauces: ${backup.pizzaSauces.length}`);
    console.log(`   - Toppings: ${backup.toppings.length}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();