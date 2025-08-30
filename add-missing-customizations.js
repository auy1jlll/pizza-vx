const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMissingCustomizations() {
  try {
    console.log('🔧 Adding customizations for remaining menu items...');

    // Get the existing groups we need to connect
    const dressingGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Choose Your Dressing' }
    });

    const sauceGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Choose Your Sauce' }
    });

    const spiceGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Spice Level' }
    });

    const vegetableGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Vegetables' }
    });

    // Get menu items that need customizations
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: true
      }
    });

    const itemsWithoutCustomizations = menuItems.filter(item => item.customizationGroups.length === 0);

    console.log(`Found ${itemsWithoutCustomizations.length} items without customizations`);

    // Connect appropriate customizations
    for (const item of itemsWithoutCustomizations) {
      const connections = [];

      switch (item.category.name) {
        case 'Side Orders':
          if (item.name.toLowerCase().includes('soup') ||
              item.name.toLowerCase().includes('chowder') ||
              item.name.toLowerCase().includes('chili')) {
            // Soups and chowders get spice level
            if (spiceGroup) {
              connections.push({
                customizationGroupId: spiceGroup.id,
                isRequired: false,
                sortOrder: 1
              });
            }
          } else if (item.name.toLowerCase().includes('salad')) {
            // Pasta salad gets dressing and vegetables
            if (dressingGroup) {
              connections.push({
                customizationGroupId: dressingGroup.id,
                isRequired: false,
                sortOrder: 1
              });
            }
            if (vegetableGroup) {
              connections.push({
                customizationGroupId: vegetableGroup.id,
                isRequired: false,
                sortOrder: 2
              });
            }
          } else if (item.name.toLowerCase().includes('egg roll') ||
                     item.name.toLowerCase().includes('ravioli') ||
                     item.name.toLowerCase().includes('mozzarella')) {
            // Fried items get sauce options
            if (sauceGroup) {
              connections.push({
                customizationGroupId: sauceGroup.id,
                isRequired: false,
                sortOrder: 1
              });
            }
          }
          break;

        case 'Soups & Chowders':
          // All soups get spice level
          if (spiceGroup) {
            connections.push({
              customizationGroupId: spiceGroup.id,
              isRequired: false,
              sortOrder: 1
            });
          }
          break;

        case 'Fried Appetizers':
          // Fried appetizers get sauce options
          if (sauceGroup) {
            connections.push({
              customizationGroupId: sauceGroup.id,
              isRequired: false,
              sortOrder: 1
            });
          }
          break;
      }

      // Create connections
      for (const connection of connections) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: connection.customizationGroupId,
            isRequired: connection.isRequired,
            sortOrder: connection.sortOrder
          }
        });
      }

      if (connections.length > 0) {
        console.log(`✅ Connected ${connections.length} customizations to ${item.name}`);
      }
    }

    console.log('\n🎉 Additional customizations added!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingCustomizations();
