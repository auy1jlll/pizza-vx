// Check for duplicate customization groups
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicateGroups() {
  try {
    console.log('🔍 Checking for duplicate customization groups...\n');

    // Find groups with the same name for the same menu item
    const duplicates = await prisma.menuItemCustomization.findMany({
      include: {
        menuItem: true,
        customizationGroup: {
          include: {
            options: true
          }
        }
      },
      orderBy: [
        { menuItem: { name: 'asc' } },
        { customizationGroup: { name: 'asc' } }
      ]
    });

    // Group by menu item and customization group name
    const grouped = {};
    duplicates.forEach(item => {
      const key = `${item.menuItem.name}|${item.customizationGroup.name}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    console.log('📊 Duplicate Analysis:');
    Object.entries(grouped).forEach(([key, items]) => {
      if (items.length > 1) {
        const [menuItemName, groupName] = key.split('|');
        console.log(`\n❌ DUPLICATE: ${menuItemName} - ${groupName} (${items.length} instances)`);
        items.forEach((item, index) => {
          console.log(`   ${index + 1}. Group ID: ${item.customizationGroup.id}, Options: ${item.customizationGroup.options.length}, Required: ${item.isRequired}`);
        });
      }
    });

    // Find groups with no options that are required
    const emptyRequiredGroups = duplicates.filter(item => 
      item.customizationGroup.options.length === 0 && item.isRequired
    );

    console.log(`\n⚠️  Empty Required Groups: ${emptyRequiredGroups.length}`);
    emptyRequiredGroups.slice(0, 10).forEach(item => {
      console.log(`   - ${item.menuItem.name}: ${item.customizationGroup.name} (0 options, required)`);
    });

    // Count total groups per menu item
    const itemCounts = {};
    duplicates.forEach(item => {
      const itemName = item.menuItem.name;
      if (!itemCounts[itemName]) {
        itemCounts[itemName] = 0;
      }
      itemCounts[itemName]++;
    });

    console.log('\n📈 Groups per menu item:');
    Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([name, count]) => {
        console.log(`   ${name}: ${count} groups`);
      });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicateGroups();
