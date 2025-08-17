const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDinnerPlatesItems() {
  try {
    console.log('🔍 Checking Dinner Plates category and its items...\n');
    
    // First check the category
    const category = await prisma.menuCategory.findUnique({
      where: { slug: 'dinner-plates' }
    });
    
    console.log('📋 Category:', category);
    
    if (category) {
      // Check menu items in this category
      const menuItems = await prisma.menuItem.findMany({
        where: {
          categoryId: category.id,
          isAvailable: true
        },
        include: {
          category: true
        }
      });
      
      console.log(`\n📋 Menu items in "Dinner Plates" category: ${menuItems.length}`);
      menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.isActive ? 'Active' : 'Inactive'}, ${item.isAvailable ? 'Available' : 'Unavailable'})`);
      });
      
      // Also check what the CustomizationEngine returns
      const { CustomizationEngine } = require('./src/lib/customization-engine.ts');
      const engine = new CustomizationEngine();
      
      console.log('\n🔧 Testing CustomizationEngine.getMenuData("dinner-plates")...');
      const engineResult = await engine.getMenuData('dinner-plates');
      console.log(`📋 CustomizationEngine returned: ${engineResult?.length || 0} items`);
      
      if (engineResult && engineResult.length > 0) {
        console.log('✅ First item:', engineResult[0].name);
      } else {
        console.log('❌ No items returned by CustomizationEngine');
      }
      
      await engine.disconnect();
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDinnerPlatesItems();
