const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCustomizationDetails() {
  try {
    console.log('🔍 Detailed Customization Analysis:\n');

    // Get all customization groups with their options
    const groups = await prisma.customizationGroup.findMany({
      include: {
        options: true,
        menuItemCustomizations: {
          include: {
            menuItem: true
          }
        },
        category: true
      },
      orderBy: { name: 'asc' }
    });

    for (const group of groups) {
      console.log(`📁 ${group.name} (${group.type})`);
      console.log(`   Category: ${group.category ? group.category.name : 'Global'}`);
      console.log(`   Applied to: ${group.menuItemCustomizations.map(mi => mi.menuItem.name).join(', ') || 'None'}`);
      console.log(`   Options (${group.options.length}):`);
      group.options.forEach(option => {
        const price = option.priceModifier > 0 ? ` (+$${option.priceModifier})` : option.priceModifier < 0 ? ` (-$${Math.abs(option.priceModifier)})` : '';
        console.log(`     - ${option.name}${price}`);
      });
      console.log('');
    }

    // Check for missing customization types
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    console.log('\n🔍 Menu Items Customization Coverage:');
    for (const item of menuItems) {
      console.log(`\n📋 ${item.name} (${item.category.name})`);
      if (item.customizationGroups.length === 0) {
        console.log('   ❌ No customization groups assigned');
      } else {
        console.log(`   ✅ Customization groups (${item.customizationGroups.length}):`);
        item.customizationGroups.forEach(cg => {
          console.log(`     - ${cg.customizationGroup.name}`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCustomizationDetails();
