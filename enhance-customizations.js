const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enhanceCustomizations() {
  try {
    console.log('🚀 Enhancing customization system with additional options...');

    // Get existing groups to avoid duplicates
    const existingGroups = await prisma.customizationGroup.findMany();
    const groupNames = existingGroups.map(g => g.name);

    // 1. Enhanced VEGETABLE TOPPINGS (for sandwiches, subs, salads, wraps)
    if (!groupNames.includes('Add Vegetables')) {
      const veggieGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Add Vegetables',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 6,
          sortOrder: 4,
          isActive: true,
          options: {
            create: [
              { name: 'Extra Lettuce', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Extra Tomatoes', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Extra Onions', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 3 },
              { name: 'Hot Peppers', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 4 },
              { name: 'Banana Peppers', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 5 },
              { name: 'Jalapeños', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 6 },
              { name: 'Mushrooms', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 7 },
              { name: 'Green Peppers', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 8 },
              { name: 'Black Olives', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 9 },
              { name: 'Fresh Garlic', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 10 }
            ]
          }
        }
      });
      console.log('✅ Created Enhanced Vegetable Toppings group');
    }

    // 2. ADDITIONAL SAUCES (for appetizers, sides, specialty items)
    if (!groupNames.includes('Extra Sauces')) {
      const extraSaucesGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Extra Sauces',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 3,
          sortOrder: 5,
          isActive: true,
          options: {
            create: [
              { name: 'Marinara Sauce', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Ranch Dressing', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Blue Cheese Dressing', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 3 },
              { name: 'Honey Mustard', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 4 },
              { name: 'BBQ Sauce', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 5 },
              { name: 'Hot Sauce', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 6 },
              { name: 'Garlic Butter', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 7 }
            ]
          }
        }
      });
      console.log('✅ Created Extra Sauces group');
    }

    // 3. SPECIALTY TOPPINGS (for specialty items and loaded dishes)
    if (!groupNames.includes('Specialty Toppings')) {
      const specialtyGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Specialty Toppings',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 4,
          sortOrder: 6,
          isActive: true,
          options: {
            create: [
              { name: 'Bacon Bits', priceModifier: 2, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Crumbled Feta', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Parmesan Cheese', priceModifier: 1, isDefault: false, isActive: true, sortOrder: 3 },
              { name: 'Chives', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 4 },
              { name: 'Sour Cream', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 5 },
              { name: 'Extra Butter', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 6 }
            ]
          }
        }
      });
      console.log('✅ Created Specialty Toppings group');
    }

    // 4. SPICE LEVEL (for spicy dishes)
    if (!groupNames.includes('Spice Level')) {
      const spiceGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Spice Level',
          type: 'SINGLE_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 1,
          sortOrder: 7,
          isActive: true,
          options: {
            create: [
              { name: 'Mild', priceModifier: 0, isDefault: true, isActive: true, sortOrder: 1 },
              { name: 'Medium', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Hot', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 3 },
              { name: 'Extra Hot', priceModifier: 0, isDefault: false, isActive: true, sortOrder: 4 }
            ]
          }
        }
      });
      console.log('✅ Created Spice Level group');
    }

    console.log('\n🔄 Now connecting enhanced customizations to menu items...');

    // Get all menu items and existing customizations
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

    // Get the new groups we just created
    const veggieGroup = await prisma.customizationGroup.findFirst({ where: { name: 'Add Vegetables' } });
    const extraSaucesGroup = await prisma.customizationGroup.findFirst({ where: { name: 'Extra Sauces' } });
    const specialtyGroup = await prisma.customizationGroup.findFirst({ where: { name: 'Specialty Toppings' } });
    const spiceGroup = await prisma.customizationGroup.findFirst({ where: { name: 'Spice Level' } });

    // Connect enhanced customizations based on category and item type
    for (const item of menuItems) {
      const existingGroupIds = item.customizationGroups.map(cg => cg.customizationGroupId);
      const connections = [];

      switch (item.category.name) {
        case 'Salads':
          // Salads get vegetable toppings
          if (veggieGroup && !existingGroupIds.includes(veggieGroup.id)) {
            connections.push(
              { customizationGroupId: veggieGroup.id, isRequired: false, sortOrder: 2 }
            );
          }
          break;

        case 'Sandwiches':
        case 'Hot Subs':
        case 'Cold Subs':
        case 'Steak and Cheese Subs':
          // Sandwiches/subs get vegetable toppings
          if (veggieGroup && !existingGroupIds.includes(veggieGroup.id)) {
            connections.push(
              { customizationGroupId: veggieGroup.id, isRequired: false, sortOrder: 3 }
            );
          }
          break;

        case 'Fried Appetizers':
          // Fried appetizers get extra sauces
          if (extraSaucesGroup && !existingGroupIds.includes(extraSaucesGroup.id)) {
            connections.push(
              { customizationGroupId: extraSaucesGroup.id, isRequired: false, sortOrder: 1 }
            );
          }
          // Some fried items might get spice level
          if (spiceGroup && item.name.toLowerCase().includes('jalapeño') && !existingGroupIds.includes(spiceGroup.id)) {
            connections.push(
              { customizationGroupId: spiceGroup.id, isRequired: false, sortOrder: 2 }
            );
          }
          break;

        case 'Soups & Chowders':
          // Soups get specialty toppings
          if (specialtyGroup && !existingGroupIds.includes(specialtyGroup.id)) {
            connections.push(
              { customizationGroupId: specialtyGroup.id, isRequired: false, sortOrder: 1 }
            );
          }
          break;

        case 'Specialty Items':
          // Specialty items get sauces and toppings
          if (extraSaucesGroup && !existingGroupIds.includes(extraSaucesGroup.id)) {
            connections.push(
              { customizationGroupId: extraSaucesGroup.id, isRequired: false, sortOrder: 1 }
            );
          }
          if (specialtyGroup && !existingGroupIds.includes(specialtyGroup.id)) {
            connections.push(
              { customizationGroupId: specialtyGroup.id, isRequired: false, sortOrder: 2 }
            );
          }
          break;

        case 'Side Orders':
          // Side orders that might benefit from sauces
          if (item.name.toLowerCase().includes('fries') ||
              item.name.toLowerCase().includes('rings') ||
              item.name.toLowerCase().includes('mushrooms')) {
            if (extraSaucesGroup && !existingGroupIds.includes(extraSaucesGroup.id)) {
              connections.push(
                { customizationGroupId: extraSaucesGroup.id, isRequired: false, sortOrder: 1 }
              );
            }
          }
          break;

        case 'Wings':
        case 'Fingers':
          // Spicy items get spice level
          if (spiceGroup && (item.name.toLowerCase().includes('buffalo') ||
                           item.name.toLowerCase().includes('hot')) &&
              !existingGroupIds.includes(spiceGroup.id)) {
            connections.push(
              { customizationGroupId: spiceGroup.id, isRequired: false, sortOrder: 2 }
            );
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
        console.log(`✅ Enhanced ${item.name} with ${connections.length} additional customizations`);
      }
    }

    console.log('\n🎉 Enhanced customization system complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enhanceCustomizations();
