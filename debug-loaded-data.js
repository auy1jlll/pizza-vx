const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugLoadedData() {
  console.log('🔍 Debugging Current Database Data vs Application Display');
  console.log('=======================================================');
  
  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check what data is actually in the database
    console.log('\n📊 Current Database Contents:');
    console.log('=============================');
    
    // Business settings
    const businessSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['businessName', 'businessPhone', 'businessAddress', 'businessHours']
        }
      },
      select: { key: true, value: true }
    });
    
    console.log('\n🏢 Business Information:');
    businessSettings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value}`);
    });
    
    if (businessSettings.length === 0) {
      console.log('   ⚠️ NO BUSINESS SETTINGS FOUND - This may be why fallback data is showing');
    }
    
    // Menu categories with items
    console.log('\n📋 Menu Categories and Items:');
    const categoriesWithItems = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          select: { id: true, name: true, basePrice: true, isActive: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    categoriesWithItems.forEach(category => {
      const activeItems = category.menuItems.filter(item => item.isActive);
      console.log(`   📁 ${category.name}: ${activeItems.length} active items`);
      if (activeItems.length > 0) {
        activeItems.slice(0, 3).forEach(item => {
          console.log(`      - ${item.name} ($${item.basePrice})`);
        });
        if (activeItems.length > 3) {
          console.log(`      ... and ${activeItems.length - 3} more items`);
        }
      }
    });
    
    // Pizza components
    console.log('\n🍕 Pizza Components:');
    const [sizes, toppings, crusts, sauces] = await Promise.all([
      prisma.pizzaSize.findMany({ where: { isActive: true } }),
      prisma.pizzaTopping.findMany({ where: { isActive: true } }),
      prisma.pizzaCrust.findMany({ where: { isActive: true } }),
      prisma.pizzaSauce.findMany({ where: { isActive: true } })
    ]);
    
    console.log(`   Sizes: ${sizes.length} (${sizes.map(s => s.name).join(', ')})`);
    console.log(`   Crusts: ${crusts.length} (${crusts.map(c => c.name).join(', ')})`);
    console.log(`   Sauces: ${sauces.length} (${sauces.map(s => s.name).join(', ')})`);
    console.log(`   Toppings: ${toppings.length} active toppings`);
    
    // Specialty items
    const [specialtyPizzas, specialtyCalzones] = await Promise.all([
      prisma.specialtyPizza.findMany({ where: { isActive: true } }),
      prisma.specialtyCalzone.findMany({ where: { isActive: true } })
    ]);
    
    console.log(`   Specialty Pizzas: ${specialtyPizzas.length}`);
    console.log(`   Specialty Calzones: ${specialtyCalzones.length}`);
    
    // Check for common fallback indicators
    console.log('\n🚨 Fallback Data Indicators:');
    console.log('============================');
    
    const possibleFallbacks = await prisma.appSetting.findMany({
      where: {
        OR: [
          { value: { contains: 'Demo' } },
          { value: { contains: 'Sample' } },
          { value: { contains: 'Test' } },
          { value: { contains: 'Pizza Place' } },
          { value: { contains: 'Restaurant' } }
        ]
      }
    });
    
    if (possibleFallbacks.length > 0) {
      console.log('   ⚠️ Found potential fallback/demo values:');
      possibleFallbacks.forEach(setting => {
        console.log(`      ${setting.key}: "${setting.value}"`);
      });
    } else {
      console.log('   ✅ No obvious fallback values detected');
    }
    
    // Check if data is from the restored backup
    console.log('\n📅 Data Timestamps Analysis:');
    console.log('===========================');
    
    const recentData = await prisma.appSetting.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { key: true, value: true, updatedAt: true }
    });
    
    console.log('   Most recently updated settings:');
    recentData.forEach(setting => {
      console.log(`      ${setting.key}: ${setting.updatedAt.toISOString()}`);
    });
    
    // Check what the application should be displaying
    console.log('\n🎯 Expected Restaurant Data:');
    console.log('============================');
    
    const restaurantName = await prisma.appSetting.findFirst({
      where: { key: 'businessName' }
    });
    
    if (restaurantName) {
      console.log(`   Restaurant Name: ${restaurantName.value}`);
    } else {
      console.log('   ❌ NO RESTAURANT NAME SET - This is likely the main issue!');
      console.log('   💡 The app may be using default "Pizza Place" fallback');
    }
    
    // Recommendations
    console.log('\n💡 Troubleshooting Recommendations:');
    console.log('===================================');
    
    if (!restaurantName) {
      console.log('   1. ⚠️ Set business name in app_settings table');
      console.log('   2. 🔄 Check if app is reading from correct database');
      console.log('   3. 🚀 Restart application to clear any cached fallback data');
    }
    
    if (categoriesWithItems.length === 0) {
      console.log('   1. ⚠️ No menu categories found - menu may appear empty');
      console.log('   2. 🔄 Verify backup restoration completed correctly');
    }
    
  } catch (error) {
    console.error('❌ Error debugging data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run debug
if (require.main === module) {
  debugLoadedData().catch(console.error);
}

module.exports = { debugLoadedData };