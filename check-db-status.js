const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database status...\n');
    
    const userCount = await prisma.user.count();
    console.log('👥 Users:', userCount);
    
    const categoryCount = await prisma.menuCategory.count();
    console.log('📂 Menu Categories:', categoryCount);
    
    const pizzaSizeCount = await prisma.pizzaSize.count();
    console.log('🍕 Pizza Sizes:', pizzaSizeCount);
    
    const toppingCount = await prisma.pizzaTopping.count();
    console.log('🧀 Pizza Toppings:', toppingCount);
    
    const settingCount = await prisma.appSetting.count();
    console.log('⚙️ Settings:', settingCount);
    
    const menuItemCount = await prisma.menuItem.count();
    console.log('🍽️ Menu Items:', menuItemCount);
    
    const customizationGroupCount = await prisma.customizationGroup.count();
    console.log('🎛️ Customization Groups:', customizationGroupCount);
    
    const customizationOptionCount = await prisma.customizationOption.count();
    console.log('🔧 Customization Options:', customizationOptionCount);
    
    console.log('\n✅ Database check complete!');
    
    // If we have some data, let's see what categories exist
    if (categoryCount > 0) {
      console.log('\n📂 Existing Categories:');
      const categories = await prisma.menuCategory.findMany({
        select: { id: true, name: true, description: true }
      });
      categories.forEach(cat => console.log(`  - ${cat.name}: ${cat.description || 'No description'}`));
    }
    
    // Check if admin user exists
    if (userCount > 0) {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true, email: true, name: true, role: true }
      });
      
      if (adminUser) {
        console.log('\n👑 Admin user found:', adminUser.email);
      } else {
        console.log('\n⚠️ No admin user found');
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
