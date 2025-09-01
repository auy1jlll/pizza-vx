const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkForDuplicates() {
  try {
    console.log('🔍 Checking for duplicate sandwich items in other categories...\n');

    // Get the Sandwiches category
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found');
      return;
    }

    // Get all items in the Sandwiches category
    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id }
    });

    const sandwichNames = sandwichItems.map(item => item.name.toLowerCase());

    console.log('🥪 Items in Sandwiches category:');
    sandwichItems.forEach(item => {
      console.log(`  • ${item.name} - $${item.basePrice}`);
    });

    // Check for similar items in other categories
    console.log('\n🔍 Checking other categories for similar items...\n');

    const allOtherItems = await prisma.menuItem.findMany({
      where: {
        categoryId: { not: sandwichesCategory.id }
      },
      include: {
        category: true
      }
    });

    const potentialDuplicates = [];

    allOtherItems.forEach(item => {
      const itemNameLower = item.name.toLowerCase();
      
      // Check for exact matches or similar names
      const isLikely = sandwichNames.some(sandwichName => {
        return itemNameLower.includes('sandwich') ||
               itemNameLower.includes('burger') ||
               itemNameLower.includes('reuben') ||
               itemNameLower.includes('gyro') ||
               itemNameLower.includes('hot dog') ||
               itemNameLower.includes('haddock') ||
               itemNameLower.includes('pastrami') ||
               itemNameLower.includes('beef') ||
               (itemNameLower.includes('chicken') && itemNameLower.includes('sandwich'));
      });

      if (isLikely) {
        potentialDuplicates.push(item);
      }
    });

    if (potentialDuplicates.length > 0) {
      console.log('⚠️ Found potential duplicate sandwich items in other categories:');
      potentialDuplicates.forEach(item => {
        console.log(`  • ${item.name} - $${item.basePrice} (in ${item.category.name})`);
      });

      console.log('\n💡 You may want to review these items and consider removing duplicates if they exist.');
    } else {
      console.log('✅ No obvious duplicates found in other categories.');
    }

    // Verify the new category is properly set up
    console.log('\n📋 Final verification:');
    console.log(`Category: ${sandwichesCategory.name} (${sandwichesCategory.slug})`);
    console.log(`Total items: ${sandwichItems.length}`);
    console.log(`Sort order: ${sandwichesCategory.sortOrder}`);
    console.log(`Active: ${sandwichesCategory.isActive}`);

  } catch (error) {
    console.error('❌ Error checking for duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkForDuplicates();
