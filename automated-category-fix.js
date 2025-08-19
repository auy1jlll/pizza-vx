const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runAutomatedFix() {
  console.log('🚀 STARTING AUTOMATED CUSTOMIZATION CATEGORY FIX\n');
  
  try {
    // Step 1: Create proper MenuCategories
    console.log('📝 Step 1: Creating proper MenuCategories...');
    
    const categoriesToCreate = [
      { name: 'Sandwiches', slug: 'sandwiches', description: 'Sandwich menu items', sortOrder: 1 },
      { name: 'Salads', slug: 'salads', description: 'Fresh salad options', sortOrder: 2 },
      { name: 'Seafood', slug: 'seafood', description: 'Fresh seafood dishes', sortOrder: 3 },
      { name: 'Dinner Plates', slug: 'dinner-plates', description: 'Main course dinner plates', sortOrder: 4 },
      { name: 'Pizza', slug: 'pizza', description: 'Pizza options', sortOrder: 5 }
    ];
    
    const createdCategories = {};
    
    for (const catData of categoriesToCreate) {
      // Check if category already exists
      let category = await prisma.menuCategory.findUnique({
        where: { slug: catData.slug }
      });
      
      if (!category) {
        category = await prisma.menuCategory.create({
          data: {
            name: catData.name,
            slug: catData.slug,
            description: catData.description,
            isActive: true,
            sortOrder: catData.sortOrder
          }
        });
        console.log(`  ✅ Created category: ${catData.name}`);
      } else {
        console.log(`  ℹ️  Category already exists: ${catData.name}`);
      }
      
      createdCategories[catData.name] = category;
    }
    
    // Step 2: Get all CustomizationGroups
    console.log('\n📊 Step 2: Analyzing CustomizationGroups...');
    
    const groups = await prisma.customizationGroup.findMany({
      include: { category: true }
    });
    
    console.log(`Found ${groups.length} CustomizationGroups`);
    
    // Step 3: Smart reassignment
    console.log('\n🎯 Step 3: Reassigning groups to correct categories...');
    
    const assignmentRules = {
      // Sandwich-related
      'sandwiches': ['bread', 'sub', 'sandwich', 'condiment', 'add-on', 'extra'],
      // Salad-related
      'salads': ['dressing', 'salad', 'protein choice', 'topping'],
      // Seafood-related
      'seafood': ['cooking', 'preparation', 'fish', 'seafood'],
      // Dinner Plates
      'dinner-plates': ['side', 'sauce level', 'temperature', 'dinner'],
      // Pizza
      'pizza': ['pizza', 'crust', 'sauce type']
    };
    
    let updatedCount = 0;
    let globalCount = 0;
    
    for (const group of groups) {
      const groupNameLower = group.name.toLowerCase();
      let targetCategoryName = null;
      
      // Find matching category based on keywords
      for (const [categorySlug, keywords] of Object.entries(assignmentRules)) {
        if (keywords.some(keyword => groupNameLower.includes(keyword))) {
          const categoryName = categoriesToCreate.find(c => c.slug === categorySlug)?.name;
          if (categoryName && createdCategories[categoryName]) {
            targetCategoryName = categoryName;
            break;
          }
        }
      }
      
      if (targetCategoryName) {
        const targetCategory = createdCategories[targetCategoryName];
        const currentCategoryName = group.category?.name || 'NULL';
        
        if (currentCategoryName !== targetCategoryName) {
          await prisma.customizationGroup.update({
            where: { id: group.id },
            data: { categoryId: targetCategory.id }
          });
          console.log(`  ➡️  "${group.name}" → ${targetCategoryName}`);
          updatedCount++;
        } else {
          console.log(`  ✓ "${group.name}" already in ${targetCategoryName}`);
        }
      } else {
        // Set to global (NULL) if no specific category matches
        if (group.categoryId) {
          await prisma.customizationGroup.update({
            where: { id: group.id },
            data: { categoryId: null }
          });
          console.log(`  🌐 "${group.name}" → GLOBAL (NULL)`);
          globalCount++;
        } else {
          console.log(`  🌐 "${group.name}" already GLOBAL`);
        }
      }
    }
    
    // Step 4: Final verification
    console.log('\n✅ Step 4: Final verification...');
    
    const finalGroups = await prisma.customizationGroup.findMany({
      include: { category: true }
    });
    
    const distribution = {};
    finalGroups.forEach(group => {
      const categoryName = group.category?.name || 'GLOBAL';
      distribution[categoryName] = (distribution[categoryName] || 0) + 1;
    });
    
    console.log('\nFinal distribution:');
    Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([categoryName, count]) => {
        console.log(`  ${categoryName}: ${count} groups`);
      });
    
    console.log(`\n🎉 FIX COMPLETED SUCCESSFULLY!`);
    console.log(`   • Updated ${updatedCount} group assignments`);
    console.log(`   • Set ${globalCount} groups to global`);
    console.log(`   • Total groups processed: ${groups.length}`);
    
    // Check if the "menucategory" problem is fixed
    const menucategoryGroups = finalGroups.filter(g => g.category?.name === 'menucategory');
    if (menucategoryGroups.length === 0) {
      console.log(`   ✅ "menucategory" problem resolved!`);
    } else {
      console.log(`   ⚠️  Still ${menucategoryGroups.length} groups under "menucategory"`);
    }
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
runAutomatedFix();
