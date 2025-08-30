const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyEnhancements() {
  try {
    console.log('🔍 Verifying enhanced customizations...\n');

    // Check all customization groups
    const groups = await prisma.customizationGroup.findMany({
      include: {
        options: true,
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    console.log('📋 ALL CUSTOMIZATION GROUPS:');
    console.log('='.repeat(50));

    groups.forEach(group => {
      console.log(`\n📁 ${group.name} (${group.id})`);
      console.log(`   Type: ${group.type}, Connected to: ${group._count.menuItemCustomizations} items`);
      console.log(`   Options (${group.options.length}):`);

      group.options.slice(0, 5).forEach(opt => {
        console.log(`   • ${opt.name} ($${opt.priceModifier})`);
      });

      if (group.options.length > 5) {
        console.log(`   ... and ${group.options.length - 5} more`);
      }
    });

    // Check specific items that should have vegetable toppings
    console.log('\n\n🥬 CHECKING ITEMS WITH VEGETABLE TOPPINGS:');
    console.log('='.repeat(50));

    const saladItems = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Salads'
        }
      },
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

    saladItems.forEach(item => {
      console.log(`\n${item.name}:`);
      const veggieGroup = item.customizationGroups.find(cg =>
        cg.customizationGroup.name === 'Add Vegetables'
      );

      if (veggieGroup) {
        console.log(`  ✅ Has vegetable toppings (${veggieGroup.customizationGroup.options.length} options)`);
        veggieGroup.customizationGroup.options.slice(0, 3).forEach(opt => {
          console.log(`    • ${opt.name} ($${opt.priceModifier})`);
        });
      } else {
        console.log(`  ❌ Missing vegetable toppings`);
      }
    });

    // Check fried appetizers
    console.log('\n\n🍟 CHECKING FRIED APPETIZERS:');
    console.log('='.repeat(50));

    const friedItems = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Fried Appetizers'
        }
      },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    friedItems.forEach(item => {
      console.log(`\n${item.name}:`);
      const sauceGroup = item.customizationGroups.find(cg =>
        cg.customizationGroup.name === 'Extra Sauces'
      );

      if (sauceGroup) {
        console.log(`  ✅ Has extra sauces`);
      } else {
        console.log(`  ❌ Missing extra sauces`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyEnhancements();
