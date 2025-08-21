const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMenuData() {
  try {
    console.log('🔍 Checking menu data...\n');

    // Check menu categories
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`📂 Menu Categories: ${categories.length} found`);
    categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));

    // Check menu items by category
    for (const category of categories) {
      const items = await prisma.menuItem.findMany({
        where: { categoryId: category.id },
        orderBy: { sortOrder: 'asc' }
      });
      
      console.log(`\n🍽️ ${category.name}: ${items.length} items`);
      items.forEach(item => console.log(`   - ${item.name} ($${item.basePrice})`));
    }

    // Check customization groups
    const customizationGroups = await prisma.customizationGroup.count();
    console.log(`\n⚙️ Customization Groups: ${customizationGroups} found`);

    console.log('\n✅ Menu data check complete!');

  } catch (error) {
    console.error('❌ Error checking menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuData();
