const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addBreadTypeCustomization() {
  try {
    console.log('🍞 Adding Bread Type customization for subs...');

    // Find the Cold Subs and Hot Subs categories
    const categories = await prisma.menuCategory.findMany({
      where: {
        name: {
          in: ['Cold Subs', 'Hot Subs']
        }
      }
    });

    if (categories.length === 0) {
      throw new Error('Cold Subs and Hot Subs categories not found');
    }

    console.log(`Found ${categories.length} sub categories`);

    // Create the Bread Type customization group
    const breadTypeGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Bread Type',
        description: 'Select your bread',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    console.log('✅ Created Bread Type customization group');

    // Create bread options based on your requirements
    const breadOptions = [
      {
        name: 'Small Sub Roll',
        description: 'Regular small sub roll',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: true,
        sortOrder: 1
      },
      {
        name: 'Large Sub Roll',
        description: 'Large sub roll',
        priceModifier: 1.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 2
      },
      {
        name: 'Spinach Wrap',
        description: 'Fresh spinach wrap',
        priceModifier: 1.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 3
      },
      {
        name: 'Tomato Basil Wrap',
        description: 'Tomato basil flavored wrap',
        priceModifier: 1.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 4
      },
      {
        name: 'Wheat Wrap',
        description: 'Whole wheat wrap',
        priceModifier: 1.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 5
      },
      {
        name: 'White Wrap',
        description: 'Classic white wrap',
        priceModifier: 1.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 6
      },
      {
        name: 'No Bread',
        description: 'No bread - lettuce wrap style',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 7
      }
    ];

    // Create all bread options
    const createdOptions = [];
    for (const option of breadOptions) {
      const createdOption = await prisma.customizationOption.create({
        data: {
          groupId: breadTypeGroup.id,
          name: option.name,
          description: option.description,
          priceModifier: option.priceModifier,
          priceType: option.priceType,
          isDefault: option.isDefault,
          isActive: true,
          sortOrder: option.sortOrder,
          maxQuantity: 1
        }
      });
      createdOptions.push(createdOption);
    }

    console.log(`✅ Created ${createdOptions.length} bread options`);

    // Connect the bread type group to both Cold Subs and Hot Subs categories
    // Note: There's no direct MenuCategoryCustomizationGroup table, so we'll connect via menu items

    // Also find menu items in these categories and update their customization connections
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category: {
          name: {
            in: ['Cold Subs', 'Hot Subs']
          }
        }
      },
      include: {
        category: true
      }
    });

    console.log(`Found ${menuItems.length} sub menu items to update`);

    // Connect bread type to all sub menu items
    for (const menuItem of menuItems) {
      // Check if this connection already exists
      const existingConnection = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: menuItem.id,
          customizationGroupId: breadTypeGroup.id
        }
      });

      if (!existingConnection) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: breadTypeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
      }
    }

    console.log('✅ Connected bread types to all sub menu items');

    // Summary
    console.log('\n🎉 Bread Type Customization Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Customization Group: ${breadTypeGroup.name}`);
    console.log(`🏷️  Group ID: ${breadTypeGroup.id}`);
    console.log(`🍞 Bread Options: ${createdOptions.length}`);
    console.log('');
    console.log('Bread Options Created:');
    createdOptions.forEach((option, index) => {
      const priceText = option.priceModifier === 0 ? 'Free' : `+$${option.priceModifier.toFixed(2)}`;
      console.log(`   ${index + 1}. ${option.name} - ${priceText}${option.isDefault ? ' (Default)' : ''}`);
    });
    console.log('');
    console.log(`🔗 Connected to ${categories.length} categories:`);
    categories.forEach(cat => console.log(`   • ${cat.name}`));
    console.log(`🔗 Connected to ${menuItems.length} menu items`);

  } catch (error) {
    console.error('❌ Error adding bread type customization:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addBreadTypeCustomization()
  .then(() => {
    console.log('\n✅ Bread type customization added successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to add bread type customization:', error);
    process.exit(1);
  });
