const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCurrentCustomizations() {
  try {
    const groups = await prisma.customizationGroup.findMany({
      include: {
        options: true,
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    console.log('📋 CURRENT CUSTOMIZATION GROUPS:');
    console.log('================================');

    groups.forEach(group => {
      console.log(`\n📁 ${group.name}`);
      console.log(`   Connected to: ${group._count.menuItemCustomizations} menu items`);
      console.log(`   Options: ${group.options.map(o => o.name).join(', ')}`);
    });

    // Check if there are any menu items without customizations
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: true
      }
    });

    const itemsWithoutCustomizations = menuItems.filter(item => item.customizationGroups.length === 0);

    if (itemsWithoutCustomizations.length > 0) {
      console.log(`\n\n⚠️  ITEMS WITHOUT CUSTOMIZATIONS (${itemsWithoutCustomizations.length}):`);
      console.log('=====================================');

      const byCategory = {};
      itemsWithoutCustomizations.forEach(item => {
        if (!byCategory[item.category.name]) {
          byCategory[item.category.name] = [];
        }
        byCategory[item.category.name].push(item.name);
      });

      Object.keys(byCategory).forEach(cat => {
        console.log(`\n${cat}:`);
        byCategory[cat].forEach(name => console.log(`  • ${name}`));
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentCustomizations();
