const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyRestoration() {
  console.log('🔍 Comprehensive Database Restoration Verification');
  console.log('================================================');
  
  try {
    // Check all major tables
    const verification = {
      users: await prisma.user.count(),
      appSettings: await prisma.appSetting.count(),
      menuCategories: await prisma.menuCategory.count(),
      menuItems: await prisma.menuItem.count(),
      pizzaSizes: await prisma.pizzaSize.count(),
      pizzaCrusts: await prisma.pizzaCrust.count(),
      pizzaSauces: await prisma.pizzaSauce.count(),
      pizzaToppings: await prisma.pizzaTopping.count(),
      specialtyPizzas: await prisma.specialtyPizza.count(),
      specialtyCalzones: await prisma.specialtyCalzone.count(),
      customizationGroups: await prisma.customizationGroup.count(),
      customizationOptions: await prisma.customizationOption.count(),
      orders: await prisma.order.count(),
      orderItems: await prisma.orderItem.count(),
    };

    console.log('\n📊 Database Table Counts:');
    console.log('========================');
    Object.entries(verification).forEach(([table, count]) => {
      const status = count > 0 ? '✅' : '⚠️ ';
      console.log(`${status} ${table.padEnd(20)}: ${count.toString().padStart(4)} records`);
    });

    // Calculate totals
    const totalRecords = Object.values(verification).reduce((sum, count) => sum + count, 0);
    const tablesWithData = Object.values(verification).filter(count => count > 0).length;
    
    console.log('\n🔢 Summary Statistics:');
    console.log('====================');
    console.log(`📈 Total records restored: ${totalRecords}`);
    console.log(`📊 Tables with data: ${tablesWithData}/${Object.keys(verification).length}`);
    console.log(`📍 Success rate: ${((tablesWithData / Object.keys(verification).length) * 100).toFixed(1)}%`);

    // Check some sample data
    console.log('\n🔍 Sample Data Verification:');
    console.log('===========================');

    // Check for admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, name: true, role: true }
    });
    console.log(`👤 Admin users found: ${adminUsers.length}`);
    if (adminUsers.length > 0) {
      adminUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.name || 'No name'}) - ${user.role}`);
      });
    }

    // Check key settings
    const keySettings = await prisma.appSetting.findMany({
      where: {
        key: { in: ['emailServiceEnabled', 'taxRate', 'deliveryFee'] }
      },
      select: { key: true, value: true, type: true }
    });
    
    console.log(`\n⚙️  Key settings found: ${keySettings.length}`);
    keySettings.forEach(setting => {
      console.log(`   - ${setting.key}: ${setting.value} (${setting.type})`);
    });

    // Check menu structure
    const menuStructure = await prisma.menuCategory.findMany({
      include: { _count: { select: { menuItems: true } } },
      orderBy: { name: 'asc' }
    });
    
    console.log(`\n🍕 Menu categories: ${menuStructure.length}`);
    menuStructure.slice(0, 5).forEach(category => {
      console.log(`   - ${category.name}: ${category._count.menuItems} items`);
    });
    if (menuStructure.length > 5) {
      console.log(`   ... and ${menuStructure.length - 5} more categories`);
    }

    // Overall status
    console.log('\n🎯 Overall Status:');
    console.log('=================');
    if (totalRecords > 500 && tablesWithData >= 10) {
      console.log('🎉 DATABASE RESTORATION SUCCESSFUL!');
      console.log('✅ Your application now has comprehensive data');
      console.log('✅ All core functionality should be working');
    } else if (totalRecords > 100) {
      console.log('⚠️  PARTIAL RESTORATION COMPLETED');
      console.log('📊 Basic data is available but some features may be limited');
    } else {
      console.log('❌ RESTORATION NEEDS ATTENTION');
      console.log('⚠️  Limited data available - check backup files');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
if (require.main === module) {
  verifyRestoration().catch(console.error);
}

module.exports = { verifyRestoration };