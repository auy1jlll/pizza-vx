const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function executeCustomizationCategoryFix() {
  console.log('🚀 EXECUTING CUSTOMIZATION CATEGORY FIX');
  console.log('============================================\n');
  
  let totalUpdated = 0;
  let errorsEncountered = [];
  
  try {
    // PHASE 1: Create Required Categories
    console.log('📋 PHASE 1: Creating Required MenuCategories');
    console.log('---------------------------------------------');
    
    const requiredCategories = [
      { name: 'Sandwiches', slug: 'sandwiches', description: 'Sub sandwiches and wraps', sortOrder: 1 },
      { name: 'Salads', slug: 'salads', description: 'Fresh salads and bowls', sortOrder: 2 },
      { name: 'Seafood', slug: 'seafood', description: 'Fresh seafood entrees', sortOrder: 3 },
      { name: 'Dinner Plates', slug: 'dinner-plates', description: 'Main course entrees', sortOrder: 4 },
      { name: 'Pizza', slug: 'pizza', description: 'Pizza options', sortOrder: 5 },
      { name: 'Appetizers', slug: 'appetizers', description: 'Starters and appetizers', sortOrder: 6 }
    ];
    
    const categoryMap = {};
    
    for (const catData of requiredCategories) {
      try {
        const category = await prisma.menuCategory.upsert({
          where: { slug: catData.slug },
          update: {
            name: catData.name,
            description: catData.description,
            isActive: true
          },
          create: {
            name: catData.name,
            slug: catData.slug,
            description: catData.description,
            isActive: true,
            sortOrder: catData.sortOrder
          }
        });
        
        categoryMap[catData.name] = category;
        console.log(`✅ ${catData.name} category ready (ID: ${category.id})`);
        
      } catch (error) {
        console.log(`❌ Error creating ${catData.name}: ${error.message}`);
        errorsEncountered.push(`Category creation: ${catData.name} - ${error.message}`);
      }
    }
    
    // PHASE 2: Analyze Current State
    console.log('\n📊 PHASE 2: Analyzing Current CustomizationGroups');
    console.log('--------------------------------------------------');
    
    const allGroups = await prisma.customizationGroup.findMany({
      include: { category: true }
    });
    
    console.log(`Found ${allGroups.length} CustomizationGroups`);
    
    // Check current distribution
    const currentDistribution = {};
    allGroups.forEach(group => {
      const categoryName = group.category?.name || 'NULL';
      currentDistribution[categoryName] = (currentDistribution[categoryName] || 0) + 1;
    });
    
    console.log('\nCurrent distribution:');
    Object.entries(currentDistribution).forEach(([name, count]) => {
      console.log(`  ${name}: ${count} groups`);
    });
    
    // PHASE 3: Smart Reassignment
    console.log('\n🎯 PHASE 3: Executing Smart Reassignment');
    console.log('------------------------------------------');
    
    const assignmentRules = [
      {
        category: 'Sandwiches',
        keywords: ['bread', 'sub', 'sandwich', 'roll', 'wrap', 'condiment', 'mayo', 'mustard'],
        exactNames: ['Bread Choice', 'Bread Type', 'Sub Size', 'Sandwich Size', 'Condiments', 'Add-ons']
      },
      {
        category: 'Salads', 
        keywords: ['salad', 'dressing', 'lettuce', 'greens', 'vinaigrette'],
        exactNames: ['Dressing Type', 'Dressing Choice', 'Salad Size', 'Salad Toppings', 'Protein Choice']
      },
      {
        category: 'Seafood',
        keywords: ['fish', 'seafood', 'salmon', 'shrimp', 'crab', 'lobster', 'cooking', 'grilled', 'fried'],
        exactNames: ['Cooking Style', 'Preparation Style', 'Seafood Size']
      },
      {
        category: 'Dinner Plates',
        keywords: ['side', 'potato', 'rice', 'vegetable', 'sauce level', 'temperature', 'dinner'],
        exactNames: ['Side Choice', 'Sides', 'Sauce Level', 'Cooking Temperature', 'Starch Choice']
      },
      {
        category: 'Pizza',
        keywords: ['pizza', 'crust', 'sauce type', 'cheese'],
        exactNames: ['Pizza Size', 'Crust Type', 'Sauce Type', 'Pizza Toppings']
      },
      {
        category: 'Appetizers',
        keywords: ['appetizer', 'starter', 'wing', 'stick', 'dip'],
        exactNames: ['Wing Size', 'Sauce Choice', 'Dip Type']
      }
    ];
    
    for (const group of allGroups) {
      try {
        const groupNameLower = group.name.toLowerCase();
        let targetCategory = null;
        let matchReason = '';
        
        // Check exact name matches first
        for (const rule of assignmentRules) {
          if (rule.exactNames.some(exactName => 
            exactName.toLowerCase() === group.name.toLowerCase()
          )) {
            targetCategory = categoryMap[rule.category];
            matchReason = `exact name match`;
            break;
          }
        }
        
        // If no exact match, check keyword matches
        if (!targetCategory) {
          for (const rule of assignmentRules) {
            if (rule.keywords.some(keyword => groupNameLower.includes(keyword))) {
              targetCategory = categoryMap[rule.category];
              matchReason = `keyword match`;
              break;
            }
          }
        }
        
        // Execute the assignment
        if (targetCategory) {
          const currentCategoryName = group.category?.name || 'NULL';
          
          if (group.categoryId !== targetCategory.id) {
            await prisma.customizationGroup.update({
              where: { id: group.id },
              data: { categoryId: targetCategory.id }
            });
            
            console.log(`✅ "${group.name}" → ${targetCategory.name} (${matchReason})`);
            totalUpdated++;
          } else {
            console.log(`✓ "${group.name}" already in ${targetCategory.name}`);
          }
        } else {
          // Set to global (NULL) for unmatched groups
          if (group.categoryId !== null) {
            await prisma.customizationGroup.update({
              where: { id: group.id },
              data: { categoryId: null }
            });
            
            console.log(`🌐 "${group.name}" → GLOBAL (no specific category match)`);
            totalUpdated++;
          } else {
            console.log(`🌐 "${group.name}" already GLOBAL`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Error updating ${group.name}: ${error.message}`);
        errorsEncountered.push(`Group update: ${group.name} - ${error.message}`);
      }
    }
    
    // PHASE 4: Verification
    console.log('\n✅ PHASE 4: Post-Fix Verification');
    console.log('----------------------------------');
    
    const finalGroups = await prisma.customizationGroup.findMany({
      include: { category: true }
    });
    
    const finalDistribution = {};
    finalGroups.forEach(group => {
      const categoryName = group.category?.name || 'GLOBAL';
      finalDistribution[categoryName] = (finalDistribution[categoryName] || 0) + 1;
    });
    
    console.log('\nFinal distribution:');
    Object.entries(finalDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([name, count]) => {
        const percentage = ((count / finalGroups.length) * 100).toFixed(1);
        console.log(`  ${name}: ${count} groups (${percentage}%)`);
      });
    
    // Check for the original problem
    const menucategoryCount = finalDistribution['menucategory'] || 0;
    const menucategoryFixed = menucategoryCount === 0;
    
    console.log('\n🎉 FIX EXECUTION COMPLETE!');
    console.log('==========================');
    console.log(`✅ Total groups updated: ${totalUpdated}`);
    console.log(`📊 Categories created: ${Object.keys(categoryMap).length}`);
    console.log(`📋 Total groups processed: ${finalGroups.length}`);
    
    if (menucategoryFixed) {
      console.log('🎯 SUCCESS: "menucategory" problem completely resolved!');
    } else {
      console.log(`⚠️  WARNING: ${menucategoryCount} groups still under "menucategory"`);
    }
    
    if (errorsEncountered.length > 0) {
      console.log(`⚠️  ${errorsEncountered.length} errors encountered:`);
      errorsEncountered.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No errors encountered during fix');
    }
    
    // Summary for better categorization
    const wellCategorized = Object.entries(finalDistribution)
      .filter(([name]) => name !== 'GLOBAL' && name !== 'menucategory')
      .reduce((sum, [,count]) => sum + count, 0);
    
    const categorizedPercentage = ((wellCategorized / finalGroups.length) * 100).toFixed(1);
    console.log(`📈 Categorization success rate: ${categorizedPercentage}%`);
    
    return {
      success: true,
      totalUpdated,
      menucategoryFixed,
      finalDistribution,
      errorsEncountered
    };
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR during fix execution:', error);
    return {
      success: false,
      error: error.message,
      totalUpdated,
      errorsEncountered
    };
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed');
  }
}

// Execute the fix immediately
executeCustomizationCategoryFix()
  .then(result => {
    if (result.success) {
      console.log('\n🎊 MISSION ACCOMPLISHED! Your customization categories are now properly organized.');
    } else {
      console.log('\n💥 Mission failed, but we tried our best!');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });
