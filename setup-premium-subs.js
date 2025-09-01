const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupPremiumSubsCustomization() {
  try {
    console.log('🥩 Setting up premium subs customization...');

    // Step 1: Update prices for premium items
    console.log('\n💰 Setting premium prices...');
    
    const steakTipsUpdate = await prisma.menuItem.updateMany({
      where: {
        name: 'Steak Tips Kabob'
      },
      data: {
        basePrice: 16.75
      }
    });

    const chickenCaesarUpdate = await prisma.menuItem.updateMany({
      where: {
        name: 'Chicken Caesar Wrap'
      },
      data: {
        basePrice: 15.25
      }
    });

    console.log(`✅ Updated Steak Tips Kabob to $16.75 (${steakTipsUpdate.count} items)`);
    console.log(`✅ Updated Chicken Caesar Wrap to $15.25 (${chickenCaesarUpdate.count} items)`);

    // Step 2: Create new bread type group for large/premium items
    console.log('\n🍞 Creating large-only bread type group...');
    
    const largeBreadGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Bread Type - Large Only',
        description: 'Select your bread (Large sizes only)',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    console.log(`✅ Created large-only bread group: ${largeBreadGroup.name}`);

    // Step 3: Create bread options (without small sub roll)
    const largeBreadOptions = [
      {
        name: 'Large Sub Roll',
        description: 'Large sub roll',
        priceModifier: 0.00, // No additional charge since price is built into base
        priceType: 'FLAT',
        isDefault: true,
        sortOrder: 1
      },
      {
        name: 'Spinach Wrap',
        description: 'Fresh spinach wrap',
        priceModifier: 0.00, // No additional charge since price is built into base
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 2
      },
      {
        name: 'Tomato Basil Wrap',
        description: 'Tomato basil flavored wrap',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 3
      },
      {
        name: 'Wheat Wrap',
        description: 'Whole wheat wrap',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 4
      },
      {
        name: 'White Wrap',
        description: 'Classic white wrap',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 5
      },
      {
        name: 'No Bread',
        description: 'No bread - lettuce wrap style',
        priceModifier: 0.00,
        priceType: 'FLAT',
        isDefault: false,
        sortOrder: 6
      }
    ];

    // Create all large bread options
    const createdLargeOptions = [];
    for (const option of largeBreadOptions) {
      const createdOption = await prisma.customizationOption.create({
        data: {
          groupId: largeBreadGroup.id,
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
      createdLargeOptions.push(createdOption);
    }

    console.log(`✅ Created ${createdLargeOptions.length} large-only bread options`);

    // Step 4: Find the premium items
    const premiumItems = await prisma.menuItem.findMany({
      where: {
        name: {
          in: ['Steak Tips Kabob', 'Chicken Caesar Wrap']
        }
      },
      include: {
        category: true
      }
    });

    console.log(`\n🔍 Found ${premiumItems.length} premium items to update`);

    // Step 5: Remove old bread type connections for premium items
    console.log('\n🔄 Updating bread type connections...');

    for (const item of premiumItems) {
      // Find existing bread type connections
      const existingConnections = await prisma.menuItemCustomization.findMany({
        where: {
          menuItemId: item.id,
          customizationGroup: {
            name: 'Bread Type'
          }
        }
      });

      // Delete old connections
      for (const connection of existingConnections) {
        await prisma.menuItemCustomization.delete({
          where: {
            id: connection.id
          }
        });
      }

      // Create new connection to large-only bread group
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: largeBreadGroup.id,
          isRequired: true,
          sortOrder: 1
        }
      });

      console.log(`✅ Updated ${item.name} to use large-only bread options`);
    }

    // Step 6: Verify the setup
    const verifyItems = await prisma.menuItem.findMany({
      where: {
        name: {
          in: ['Steak Tips Kabob', 'Chicken Caesar Wrap']
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

    console.log('\n🎉 Premium Subs Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    verifyItems.forEach(item => {
      console.log(`📋 ${item.name}: $${item.basePrice.toFixed(2)}`);
      
      const breadGroup = item.customizationGroups.find(cg => 
        cg.customizationGroup.name === 'Bread Type - Large Only'
      );
      
      if (breadGroup) {
        console.log(`   🍞 Bread Options: ${breadGroup.customizationGroup.options.length}`);
        breadGroup.customizationGroup.options
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .forEach(option => {
            const defaultText = option.isDefault ? ' (Default)' : '';
            console.log(`      • ${option.name}${defaultText}`);
          });
      }
    });

    console.log('\n📊 Summary:');
    console.log(`🥩 Steak Tips Kabob: $16.75 (large/wrap only)`);
    console.log(`🥗 Chicken Caesar Wrap: $15.25 (large/wrap only)`);
    console.log(`🍞 Large-Only Bread Group: ${createdLargeOptions.length} options`);
    console.log(`🔗 Premium Items Updated: ${premiumItems.length}`);

  } catch (error) {
    console.error('❌ Error setting up premium subs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
setupPremiumSubsCustomization()
  .then(() => {
    console.log('\n✅ Premium subs customization setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to setup premium subs customization:', error);
    process.exit(1);
  });
