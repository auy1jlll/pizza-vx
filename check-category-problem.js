const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCustomizationCategories() {
  console.log('🔍 CHECKING CURRENT STATE...\n');
  
  try {
    // 1. Show current categories
    const categories = await prisma.menuCategory.findMany();
    console.log('Current MenuCategories:');
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.id})`));
    
    // 2. Show current group assignments
    const groups = await prisma.customizationGroup.findMany({
      include: { category: true }
    });
    
    const categoryCount = {};
    groups.forEach(group => {
      const catName = group.category?.name || 'NULL';
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });
    
    console.log('\nCurrent CustomizationGroup distribution:');
    Object.entries(categoryCount).forEach(([name, count]) => {
      console.log(`  - "${name}": ${count} groups`);
    });
    
    // 3. If all groups are under "menucategory", we need to fix this
    const menucategoryGroups = groups.filter(g => g.category?.name === 'menucategory');
    
    if (menucategoryGroups.length > 0) {
      console.log(`\n⚠️  Found ${menucategoryGroups.length} groups assigned to "menucategory"`);
      console.log('These should be redistributed to proper categories.\n');
      
      console.log('Groups currently under "menucategory":');
      menucategoryGroups.forEach(group => {
        console.log(`  - ${group.name}`);
      });
      
      console.log('\n💡 RECOMMENDED ACTION:');
      console.log('1. Create proper MenuCategory records (Sandwiches, Salads, Seafood, Dinner Plates)');
      console.log('2. Reassign CustomizationGroups to appropriate categories');
      console.log('3. Or set categoryId to NULL for global groups');
      
      console.log('\nTo fix this automatically, you can:');
      console.log('1. Run: node fix-customization-categories.js');
      console.log('2. Or manually update the categoryId values in the database');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixCustomizationCategories();
