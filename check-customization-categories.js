const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCustomizationGroupCategories() {
  try {
    console.log('=== CUSTOMIZATION GROUP CATEGORY ANALYSIS ===\n');
    
    // Get all customization groups
    const groups = await prisma.customizationGroup.findMany({
      include: {
        category: true
      },
      orderBy: { categoryId: 'asc' }
    });
    
    console.log(`📊 Total CustomizationGroup records: ${groups.length}\n`);
    
    // Group by categoryId and category name
    const categoryGroups = {};
    const categoryIdGroups = {};
    
    groups.forEach(group => {
      const categoryId = group.categoryId || 'NULL';
      const categoryName = group.category?.name || 'NO_CATEGORY';
      
      if (!categoryIdGroups[categoryId]) {
        categoryIdGroups[categoryId] = [];
      }
      categoryIdGroups[categoryId].push(group);
      
      if (!categoryGroups[categoryName]) {
        categoryGroups[categoryName] = [];
      }
      categoryGroups[categoryName].push(group);
    });
    
    console.log('📋 CATEGORY ID BREAKDOWN:');
    Object.keys(categoryIdGroups).sort().forEach(categoryId => {
      const count = categoryIdGroups[categoryId].length;
      const sampleGroup = categoryIdGroups[categoryId][0];
      const categoryName = sampleGroup.category?.name || 'NO_CATEGORY';
      console.log(`  CategoryID "${categoryId}" (${categoryName}): ${count} records`);
    });
    
    console.log('\n📋 CATEGORY NAME BREAKDOWN:');
    Object.keys(categoryGroups).sort().forEach(categoryName => {
      const count = categoryGroups[categoryName].length;
      console.log(`  "${categoryName}": ${count} records`);
    });
    
    console.log('\n🔍 SAMPLE RECORDS BY CATEGORY:');
    Object.keys(categoryGroups).sort().forEach(categoryName => {
      console.log(`\n--- Category: "${categoryName}" ---`);
      categoryGroups[categoryName].slice(0, 3).forEach(group => {
        console.log(`  • ${group.name} (ID: ${group.id}, Type: ${group.type}, Required: ${group.isRequired})`);
        console.log(`    CategoryID: ${group.categoryId}`);
      });
      if (categoryGroups[categoryName].length > 3) {
        console.log(`  ... and ${categoryGroups[categoryName].length - 3} more records`);
      }
    });
    
    // Check if all categories are the same
    const uniqueCategories = Object.keys(categoryGroups);
    if (uniqueCategories.length === 1) {
      console.log(`\n⚠️  WARNING: ALL groups belong to the same category: "${uniqueCategories[0]}"`);
      console.log('   This might not be correct - different customization groups should belong to different categories.');
    }
    
    // Check for null categoryIds
    const nullCategoryGroups = groups.filter(g => !g.categoryId);
    if (nullCategoryGroups.length > 0) {
      console.log(`\n⚠️  WARNING: ${nullCategoryGroups.length} groups have NULL categoryId:`);
      nullCategoryGroups.forEach(group => {
        console.log(`  • ${group.name} (ID: ${group.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCustomizationGroupCategories();
