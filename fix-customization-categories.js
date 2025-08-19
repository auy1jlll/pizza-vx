const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnoseAndFixCategories() {
  try {
    console.log('=== CUSTOMIZATION GROUP CATEGORY DIAGNOSIS & FIX ===\n');
    
    // Step 1: Check current MenuCategories
    console.log('📋 STEP 1: Current MenuCategories');
    const categories = await prisma.menuCategory.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log(`Found ${categories.length} MenuCategories:`);
    categories.forEach(cat => {
      console.log(`  • ID: ${cat.id} | Name: "${cat.name}" | Slug: "${cat.slug}"`);
    });
    
    // Step 2: Check current CustomizationGroup assignments
    console.log('\n📊 STEP 2: Current CustomizationGroup Category Assignments');
    const groups = await prisma.customizationGroup.findMany({
      include: {
        category: { select: { name: true, slug: true } }
      },
      orderBy: { name: 'asc' }
    });
    
    // Group by category
    const categoryAssignments = {};
    groups.forEach(group => {
      const categoryName = group.category?.name || 'NULL';
      if (!categoryAssignments[categoryName]) {
        categoryAssignments[categoryName] = [];
      }
      categoryAssignments[categoryName].push(group);
    });
    
    console.log('Current assignments:');
    Object.keys(categoryAssignments).forEach(categoryName => {
      const count = categoryAssignments[categoryName].length;
      console.log(`  "${categoryName}": ${count} groups`);
      categoryAssignments[categoryName].slice(0, 3).forEach(group => {
        console.log(`    - ${group.name} (ID: ${group.id})`);
      });
      if (categoryAssignments[categoryName].length > 3) {
        console.log(`    ... and ${categoryAssignments[categoryName].length - 3} more`);
      }
    });
    
    // Step 3: Check if we need to create proper categories
    console.log('\n🔧 STEP 3: Creating Missing Categories');
    
    const requiredCategories = [
      { name: 'Sandwiches', slug: 'sandwiches', description: 'Sandwich menu items' },
      { name: 'Salads', slug: 'salads', description: 'Fresh salad options' },
      { name: 'Seafood', slug: 'seafood', description: 'Fresh seafood dishes' },
      { name: 'Dinner Plates', slug: 'dinner-plates', description: 'Main course dinner plates' },
      { name: 'Pizza', slug: 'pizza', description: 'Pizza options' }
    ];
    
    const createdCategories = {};
    
    for (const reqCat of requiredCategories) {
      let category = categories.find(c => c.slug === reqCat.slug);
      
      if (!category) {
        console.log(`  Creating category: ${reqCat.name}`);
        category = await prisma.menuCategory.create({
          data: {
            name: reqCat.name,
            slug: reqCat.slug,
            description: reqCat.description,
            isActive: true,
            sortOrder: requiredCategories.indexOf(reqCat)
          }
        });
      } else {
        console.log(`  Category already exists: ${reqCat.name}`);
      }
      
      createdCategories[reqCat.name] = category;
    }
    
    // Step 4: Smart assignment of CustomizationGroups to correct categories
    console.log('\n🎯 STEP 4: Reassigning CustomizationGroups to Correct Categories');
    
    const groupCategoryMapping = {
      // Sandwich-related groups
      'Bread Choice': 'Sandwiches',
      'Bread Type': 'Sandwiches',
      'Sub Size': 'Sandwiches',
      'Sandwich Size': 'Sandwiches',
      'Condiments': 'Sandwiches',
      'Add-ons': 'Sandwiches',
      'Extras': 'Sandwiches',
      
      // Salad-related groups
      'Dressing Type': 'Salads',
      'Dressing': 'Salads',
      'Salad Size': 'Salads',
      'Salad Toppings': 'Salads',
      'Protein Choice': 'Salads',
      
      // Seafood-related groups
      'Cooking Style': 'Seafood',
      'Preparation Style': 'Seafood',
      'Seafood Size': 'Seafood',
      
      // Dinner Plates
      'Side Choice': 'Dinner Plates',
      'Sides': 'Dinner Plates',
      'Sauce Level': 'Dinner Plates',
      'Cooking Temperature': 'Dinner Plates',
      
      // Pizza (if any)
      'Pizza Size': 'Pizza',
      'Crust Type': 'Pizza',
      'Sauce Type': 'Pizza'
    };
    
    let assignmentCount = 0;
    let nullAssignmentCount = 0;
    
    for (const group of groups) {
      let targetCategoryName = null;
      
      // Check exact name match first
      if (groupCategoryMapping[group.name]) {
        targetCategoryName = groupCategoryMapping[group.name];
      } else {
        // Check partial matches
        const groupNameLower = group.name.toLowerCase();
        if (groupNameLower.includes('bread') || groupNameLower.includes('sub') || groupNameLower.includes('sandwich')) {
          targetCategoryName = 'Sandwiches';
        } else if (groupNameLower.includes('salad') || groupNameLower.includes('dressing')) {
          targetCategoryName = 'Salads';
        } else if (groupNameLower.includes('seafood') || groupNameLower.includes('cooking') || groupNameLower.includes('fish')) {
          targetCategoryName = 'Seafood';
        } else if (groupNameLower.includes('side') || groupNameLower.includes('sauce') || groupNameLower.includes('dinner')) {
          targetCategoryName = 'Dinner Plates';
        } else if (groupNameLower.includes('pizza') || groupNameLower.includes('crust')) {
          targetCategoryName = 'Pizza';
        }
      }
      
      if (targetCategoryName && createdCategories[targetCategoryName]) {
        const targetCategory = createdCategories[targetCategoryName];
        const currentCategoryName = group.category?.name || 'NULL';
        
        if (currentCategoryName !== targetCategoryName) {
          console.log(`  Reassigning "${group.name}" from "${currentCategoryName}" to "${targetCategoryName}"`);
          await prisma.customizationGroup.update({
            where: { id: group.id },
            data: { categoryId: targetCategory.id }
          });
          assignmentCount++;
        } else {
          console.log(`  "${group.name}" already correctly assigned to "${targetCategoryName}"`);
        }
      } else {
        console.log(`  ⚠️  Could not determine category for "${group.name}" - setting to NULL (global)`);
        if (group.categoryId) {
          await prisma.customizationGroup.update({
            where: { id: group.id },
            data: { categoryId: null }
          });
          nullAssignmentCount++;
        }
      }
    }
    
    // Step 5: Final verification
    console.log('\n✅ STEP 5: Final Verification');
    console.log(`  Updated ${assignmentCount} group assignments`);
    console.log(`  Set ${nullAssignmentCount} groups to global (NULL category)`);
    
    const finalGroups = await prisma.customizationGroup.findMany({
      include: {
        category: { select: { name: true } }
      },
      orderBy: { name: 'asc' }
    });
    
    const finalCategoryAssignments = {};
    finalGroups.forEach(group => {
      const categoryName = group.category?.name || 'GLOBAL (NULL)';
      if (!finalCategoryAssignments[categoryName]) {
        finalCategoryAssignments[categoryName] = [];
      }
      finalCategoryAssignments[categoryName].push(group);
    });
    
    console.log('\nFinal category distribution:');
    Object.keys(finalCategoryAssignments).sort().forEach(categoryName => {
      const count = finalCategoryAssignments[categoryName].length;
      console.log(`  "${categoryName}": ${count} groups`);
    });
    
    console.log('\n🎉 Category assignment fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseAndFixCategories();
