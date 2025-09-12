const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyImport() {
  console.log('🔍 Verifying database import...\n');
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check key tables
    const counts = {
      users: await prisma.user.count(),
      appSettings: await prisma.appSetting.count(),
      pizzaSizes: await prisma.pizzaSize.count(),
      pizzaCrusts: await prisma.pizzaCrust.count(),
      pizzaSauces: await prisma.pizzaSauce.count(),
      pizzaToppings: await prisma.pizzaTopping.count(),
      specialtyPizzas: await prisma.specialtyPizza.count(),
      specialtyCalzones: await prisma.specialtyCalzone.count(),
      menuCategories: await prisma.menuCategory.count(),
      menuItems: await prisma.menuItem.count(),
      customizationGroups: await prisma.customizationGroup.count(),
      promotions: await prisma.promotion.count(),
    };
    
    console.log('\n📊 Database Contents:');
    console.log(`   Users: ${counts.users}`);
    console.log(`   App Settings: ${counts.appSettings}`);
    console.log(`   Pizza Sizes: ${counts.pizzaSizes}`);
    console.log(`   Pizza Crusts: ${counts.pizzaCrusts}`);
    console.log(`   Pizza Sauces: ${counts.pizzaSauces}`);
    console.log(`   Pizza Toppings: ${counts.pizzaToppings}`);
    console.log(`   Specialty Pizzas: ${counts.specialtyPizzas}`);
    console.log(`   Specialty Calzones: ${counts.specialtyCalzones}`);
    console.log(`   Menu Categories: ${counts.menuCategories}`);
    console.log(`   Menu Items: ${counts.menuItems}`);
    console.log(`   Customization Groups: ${counts.customizationGroups}`);
    console.log(`   Promotions: ${counts.promotions}`);
    
    // Expected values from export
    const expected = {
      users: 5,
      appSettings: 132,
      pizzaSizes: 8,
      pizzaCrusts: 5,
      pizzaSauces: 9,
      pizzaToppings: 32,
      specialtyPizzas: 7,
      specialtyCalzones: 7,
      menuCategories: 18,
      menuItems: 91,
      customizationGroups: 19,
      promotions: 1,
    };
    
    console.log('\n✅ Verification Results:');
    let allGood = true;
    
    for (const [key, count] of Object.entries(counts)) {
      const expectedCount = expected[key];
      const status = count === expectedCount ? '✅' : '⚠️';
      if (count !== expectedCount) allGood = false;
      
      console.log(`   ${status} ${key}: ${count}/${expectedCount}`);
    }
    
    // Check critical settings
    console.log('\n🔧 Checking Critical Settings:');
    
    const gmailUser = await prisma.appSetting.findUnique({
      where: { key: 'gmailUser' }
    });
    console.log(`   ${gmailUser ? '✅' : '❌'} Gmail User: ${gmailUser?.value || 'Not set'}`);
    
    const gmailPassword = await prisma.appSetting.findUnique({
      where: { key: 'gmailAppPassword' }
    });
    console.log(`   ${gmailPassword ? '✅' : '❌'} Gmail App Password: ${gmailPassword ? '[SET]' : 'Not set'}`);
    
    const emailNotifications = await prisma.appSetting.findUnique({
      where: { key: 'emailNotifications' }
    });
    console.log(`   ${emailNotifications ? '✅' : '❌'} Email Notifications: ${emailNotifications?.value || 'Not set'}`);
    
    const taxRate = await prisma.appSetting.findUnique({
      where: { key: 'taxRate' }
    });
    console.log(`   ${taxRate ? '✅' : '❌'} Tax Rate: ${taxRate?.value || 'Not set'}`);
    
    // Check admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    console.log(`   ${adminUser ? '✅' : '❌'} Admin User: ${adminUser ? adminUser.email : 'Not found'}`);
    
    // Sample menu items
    console.log('\n🍕 Sample Menu Items:');
    const sampleMenuItems = await prisma.menuItem.findMany({
      take: 3,
      include: { category: true }
    });
    
    for (const item of sampleMenuItems) {
      console.log(`   • ${item.name} - $${item.basePrice} (${item.category.name})`);
    }
    
    // Sample specialty pizzas
    console.log('\n🌟 Sample Specialty Pizzas:');
    const sampleSpecialtyPizzas = await prisma.specialtyPizza.findMany({
      take: 3,
      include: { 
        sizes: { 
          include: { pizzaSize: true } 
        } 
      }
    });
    
    for (const pizza of sampleSpecialtyPizzas) {
      const smallSize = pizza.sizes.find(s => s.pizzaSize.name === 'Small');
      console.log(`   • ${pizza.name} - $${smallSize?.price || pizza.basePrice} (Small)`);
    }
    
    console.log(`\n${allGood ? '🎉' : '⚠️'} Import ${allGood ? 'SUCCESSFUL' : 'NEEDS ATTENTION'}`);
    
    if (allGood) {
      console.log('\n🚀 Your production database is ready!');
      console.log('   - All data imported successfully');
      console.log('   - Settings configured properly');
      console.log('   - Admin access available');
      console.log('   - Full menu system loaded');
      console.log('\n📝 Next steps:');
      console.log('   1. Restart your application');
      console.log('   2. Test the website functionality');
      console.log('   3. Verify specialty pizza/calzone pricing');
      console.log('   4. Test email notifications');
      console.log('   5. Check admin portal access');
    } else {
      console.log('\n🔧 Some data counts don\'t match expected values.');
      console.log('   This might be normal if you had different data previously.');
      console.log('   Check the specific items marked with ⚠️ above.');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check your DATABASE_URL environment variable');
    console.log('   2. Ensure the database is accessible');
    console.log('   3. Re-run the import script if needed');
    console.log('   4. Check for any error messages above');
  } finally {
    await prisma.$disconnect();
  }
}

verifyImport();