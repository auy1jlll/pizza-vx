// MANUAL FIX - Run this file step by step
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// STEP 1: Create proper categories
async function step1_createCategories() {
  console.log('STEP 1: Creating categories...');
  
  const categories = await Promise.all([
    prisma.menuCategory.upsert({
      where: { slug: 'sandwiches' },
      update: {},
      create: { name: 'Sandwiches', slug: 'sandwiches', description: 'Sandwich items', isActive: true, sortOrder: 1 }
    }),
    prisma.menuCategory.upsert({
      where: { slug: 'salads' },
      update: {},
      create: { name: 'Salads', slug: 'salads', description: 'Salad items', isActive: true, sortOrder: 2 }
    }),
    prisma.menuCategory.upsert({
      where: { slug: 'seafood' },
      update: {},
      create: { name: 'Seafood', slug: 'seafood', description: 'Seafood items', isActive: true, sortOrder: 3 }
    }),
    prisma.menuCategory.upsert({
      where: { slug: 'dinner-plates' },
      update: {},
      create: { name: 'Dinner Plates', slug: 'dinner-plates', description: 'Dinner items', isActive: true, sortOrder: 4 }
    })
  ]);
  
  console.log('Categories created/updated:', categories.map(c => c.name));
  return categories;
}

// STEP 2: Fix assignments
async function step2_fixAssignments() {
  console.log('STEP 2: Fixing assignments...');
  
  const [sandwiches, salads, seafood, dinnerPlates] = await step1_createCategories();
  
  // Get groups assigned to "menucategory"
  const menucategoryGroup = await prisma.menuCategory.findFirst({
    where: { name: 'menucategory' }
  });
  
  if (menucategoryGroup) {
    const groups = await prisma.customizationGroup.findMany({
      where: { categoryId: menucategoryGroup.id }
    });
    
    console.log(`Found ${groups.length} groups under "menucategory"`);
    
    for (const group of groups) {
      const name = group.name.toLowerCase();
      let newCategoryId = null;
      
      if (name.includes('bread') || name.includes('sub') || name.includes('sandwich') || name.includes('condiment')) {
        newCategoryId = sandwiches.id;
        console.log(`${group.name} → Sandwiches`);
      } else if (name.includes('salad') || name.includes('dressing') || name.includes('protein')) {
        newCategoryId = salads.id;
        console.log(`${group.name} → Salads`);
      } else if (name.includes('seafood') || name.includes('cooking') || name.includes('fish') || name.includes('preparation')) {
        newCategoryId = seafood.id;
        console.log(`${group.name} → Seafood`);
      } else if (name.includes('side') || name.includes('sauce') || name.includes('dinner') || name.includes('temperature')) {
        newCategoryId = dinnerPlates.id;
        console.log(`${group.name} → Dinner Plates`);
      } else {
        // Set to null for global groups
        newCategoryId = null;
        console.log(`${group.name} → GLOBAL`);
      }
      
      await prisma.customizationGroup.update({
        where: { id: group.id },
        data: { categoryId: newCategoryId }
      });
    }
  }
}

// STEP 3: Verify results
async function step3_verify() {
  console.log('STEP 3: Verifying results...');
  
  const groups = await prisma.customizationGroup.findMany({
    include: { category: true }
  });
  
  const distribution = {};
  groups.forEach(group => {
    const categoryName = group.category?.name || 'GLOBAL';
    distribution[categoryName] = (distribution[categoryName] || 0) + 1;
  });
  
  console.log('Final distribution:');
  Object.entries(distribution).forEach(([name, count]) => {
    console.log(`  ${name}: ${count} groups`);
  });
  
  const menucategoryCount = distribution['menucategory'] || 0;
  if (menucategoryCount === 0) {
    console.log('✅ SUCCESS: No more "menucategory" assignments!');
  } else {
    console.log(`⚠️  WARNING: Still ${menucategoryCount} groups under "menucategory"`);
  }
}

// Run all steps
async function runFix() {
  try {
    await step1_createCategories();
    await step2_fixAssignments();
    await step3_verify();
    console.log('\n🎉 FIX COMPLETED!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runFix();
