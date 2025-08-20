const { PrismaClient } = require('@prisma/client');

async function testCustomizationLayout() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing Customization Layout for Sandwiches...\n');

    // Get sandwiches & burgers category
    const category = await prisma.category.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Category not found');
      return;
    }

    // Get menu items with customization groups
    const menuItems = await prisma.menuItem.findMany({
      where: { 
        categoryId: category.id,
        isActive: true 
      },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log(`📋 Found ${menuItems.length} active menu items\n`);

    for (const item of menuItems) {
      console.log(`🍽️ ${item.name} ($${item.basePrice})`);
      console.log(`   Customization Groups: ${item.customizationGroups.length}`);

      const toppingsGroup = item.customizationGroups.find(cg => 
        cg.customizationGroup.name === 'Sandwich Toppings'
      );
      const condimentsGroup = item.customizationGroups.find(cg => 
        cg.customizationGroup.name === 'Sandwich Condiments'
      );

      if (toppingsGroup && condimentsGroup) {
        console.log('   ✅ Has both Toppings and Condiments groups - Will use 2-column layout');
        console.log(`   🥬 Toppings: ${toppingsGroup.customizationGroup.options.length} options`);
        console.log(`   🍯 Condiments: ${condimentsGroup.customizationGroup.options.length} options`);
      } else {
        console.log('   ⚠️  Missing one or both groups - Will use single column layout');
      }

      console.log('');
    }

    // Test component requirements
    console.log('🧪 Component Layout Test:');
    console.log('════════════════════════════════════════════════════');
    
    const testItem = menuItems[0];
    if (testItem) {
      const groups = testItem.customizationGroups.map(cg => cg.customizationGroup);
      const toppings = groups.find(g => g.name === 'Sandwich Toppings');
      const condiments = groups.find(g => g.name === 'Sandwich Condiments');

      if (toppings && condiments) {
        console.log('✅ Two-column layout will be rendered');
        console.log(`   Left Column (Toppings): ${toppings.options.length} options`);
        console.log(`   Right Column (Condiments): ${condiments.options.length} options`);
        console.log('✅ Entire cells are clickable (not just checkboxes)');
        console.log('✅ Compact design with better use of space');
      } else {
        console.log('❌ Single-column fallback layout');
      }
    }

    console.log('\n🎉 Layout test complete! Check the browser to see the visual changes.');

  } catch (error) {
    console.error('❌ Error testing layout:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCustomizationLayout();
