const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeMenu() {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          select: {
            name: true,
            basePrice: true
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('🍽️ CURRENT MENU STRUCTURE ANALYSIS\n');
    console.log('================================================================================');
    
    categories.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.name.toUpperCase()} (${category.menuItems.length} items)`);
      console.log(`   Slug: ${category.slug}`);
      console.log('   Items:');
      category.menuItems.forEach((item, itemIndex) => {
        console.log(`      ${itemIndex + 1}. ${item.name} - $${item.basePrice}`);
      });
    });

    console.log('\n================================================================================');
    console.log('📊 SUMMARY:');
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Items: ${categories.reduce((sum, cat) => sum + cat.menuItems.length, 0)}`);
    
    console.log('\n🔍 CATEGORY GROUPING ANALYSIS:');
    console.log('\n📍 SUB-BASED CATEGORIES:');
    const subCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('sub') || 
      cat.name.toLowerCase().includes('sandwich')
    );
    subCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.menuItems.length} items)`);
    });

    console.log('\n🐟 SEAFOOD CATEGORIES:');
    const seafoodCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('seafood')
    );
    seafoodCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.menuItems.length} items)`);
    });

    console.log('\n🍽️ DINNER/MAIN CATEGORIES:');
    const dinnerCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('dinner') || 
      cat.name.toLowerCase().includes('pasta') ||
      cat.name.toLowerCase().includes('plate')
    );
    dinnerCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.menuItems.length} items)`);
    });

    console.log('\n🥗 LIGHTER OPTIONS:');
    const lightCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('salad') || 
      cat.name.toLowerCase().includes('side')
    );
    lightCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.menuItems.length} items)`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeMenu();
