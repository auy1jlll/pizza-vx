// Test the fixed menu relationships after bulk upload
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMenuRelationships() {
  console.log('🔍 Testing menu relationships after bulk upload...\n');
  
  try {
    // Test menu items with customizations
    const menuItemsWithCustomizations = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      },
      take: 5
    });

    console.log('📋 Sample menu items with customizations:');
    menuItemsWithCustomizations.forEach(item => {
      console.log(`\n• ${item.name} (${item.category.name})`);
      console.log(`  Price: $${item.basePrice}`);
      console.log(`  Customization Groups: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach(gc => {
        const group = gc.customizationGroup;
        console.log(`    - ${group.name} (${group.type}): ${group.options.length} options`);
        if (group.options.length > 0) {
          const sampleOptions = group.options.slice(0, 3);
          sampleOptions.forEach(opt => {
            console.log(`      → ${opt.name} (+$${opt.priceModifier})`);
          });
          if (group.options.length > 3) {
            console.log(`      → ... and ${group.options.length - 3} more`);
          }
        }
      });
    });

    // Test specific items that were having display issues
    console.log('\n🎯 Testing specific items that had display issues:');
    
    const americanSub = await prisma.menuItem.findFirst({
      where: { name: 'American Sub' },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (americanSub) {
      console.log(`\n✅ American Sub found with ${americanSub.customizationGroups.length} customization groups`);
      americanSub.customizationGroups.forEach(gc => {
        const group = gc.customizationGroup;
        console.log(`   - ${group.name}: ${group.options.length} options`);
      });
    } else {
      console.log('❌ American Sub not found');
    }

    const chickenSoup = await prisma.menuItem.findFirst({
      where: { name: 'Chicken Noodle Soup' },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (chickenSoup) {
      console.log(`\n✅ Chicken Noodle Soup found with ${chickenSoup.customizationGroups.length} customization groups`);
      chickenSoup.customizationGroups.forEach(gc => {
        const group = gc.customizationGroup;
        console.log(`   - ${group.name}: ${group.options.length} options`);
      });
    } else {
      console.log('❌ Chicken Noodle Soup not found');
    }

    // Summary statistics
    console.log('\n📊 Database Summary:');
    const categoryCount = await prisma.menuCategory.count();
    const menuItemCount = await prisma.menuItem.count();
    const groupCount = await prisma.customizationGroup.count();
    const optionCount = await prisma.customizationOption.count();
    const linkCount = await prisma.menuItemCustomization.count();

    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Menu Items: ${menuItemCount}`);
    console.log(`   Customization Groups: ${groupCount}`);
    console.log(`   Customization Options: ${optionCount}`);
    console.log(`   Menu-Customization Links: ${linkCount}`);

    console.log('\n✅ Menu relationship test completed successfully!');
    console.log('\n🎉 Cart display issues should now be resolved with proper item names and customizations!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMenuRelationships();
