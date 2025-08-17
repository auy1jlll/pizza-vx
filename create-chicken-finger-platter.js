const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function createChickenFingerPlatter() {
  try {
    console.log('🍗 Creating Chicken Finger Platter with customizations...\n');

    // First, get the dinner-plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'dinner-plates' }
    });

    if (!dinnerPlatesCategory) {
      throw new Error('Dinner plates category not found!');
    }

    console.log(`✅ Found category: ${dinnerPlatesCategory.name}\n`);

    // 1. Create "Side Choice" customization group (SINGLE_SELECT)
    console.log('1️⃣ Creating Side Choice customization group...');
    const sideChoiceGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Side Choice',
        description: 'Choose your side combination',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true,
        categoryId: dinnerPlatesCategory.id
      }
    });

    // Create side choice options
    const sideOptions = [
      { name: 'French Fries & Onion Rings', priceModifier: 0.00 },
      { name: 'All French Fries', priceModifier: 0.00 },
      { name: 'All Onion Rings', priceModifier: 2.00 }
    ];

    for (const [index, option] of sideOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: index === 0, // First option is default
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: sideChoiceGroup.id
        }
      });
    }

    console.log(`   ✅ Created ${sideOptions.length} side options\n`);

    // 2. Create "Salad Choice" customization group (SINGLE_SELECT)
    console.log('2️⃣ Creating Salad Choice customization group...');
    const saladChoiceGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Salad Choice',
        description: 'Choose your salad',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        isActive: true,
        categoryId: dinnerPlatesCategory.id
      }
    });

    // Create salad choice options
    const saladOptions = [
      { name: 'Pasta Salad', priceModifier: 0.00 },
      { name: 'Cole Slaw', priceModifier: 0.00 }
    ];

    for (const [index, option] of saladOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: index === 0, // Pasta Salad is default
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: saladChoiceGroup.id
        }
      });
    }

    console.log(`   ✅ Created ${saladOptions.length} salad options\n`);

    // 3. Create "Sauce Selection" customization group (MULTI_SELECT)
    console.log('3️⃣ Creating Sauce Selection customization group...');
    const sauceSelectionGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Sauce Selection',
        description: 'Choose your dipping sauces (multiple allowed)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 5, // Allow up to 5 sauces
        sortOrder: 3,
        isActive: true,
        categoryId: dinnerPlatesCategory.id
      }
    });

    // Create sauce options
    const sauceOptions = [
      { name: 'BBQ Sauce', priceModifier: 0.00 },
      { name: 'Hot Sauce', priceModifier: 0.00 },
      { name: 'Honey Mustard', priceModifier: 0.00 },
      { name: 'Duck Sauce', priceModifier: 0.00 },
      { name: 'Ranch Dressing', priceModifier: 0.00 }
    ];

    for (const [index, option] of sauceOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: false, // No default sauces
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: sauceSelectionGroup.id
        }
      });
    }

    console.log(`   ✅ Created ${sauceOptions.length} sauce options\n`);

    // 4. Create the Chicken Finger Platter menu item
    console.log('4️⃣ Creating Chicken Finger Platter menu item...');
    const menuItem = await prisma.menuItem.create({
      data: {
        name: 'Chicken Finger Platter',
        description: 'Crispy chicken fingers served with your choice of sides, salad, and dipping sauces',
        basePrice: 14.99,
        categoryId: dinnerPlatesCategory.id,
        isActive: true,
        sortOrder: 1,
        imageUrl: '/images/chicken-finger-platter.jpg', // You can add an image later
        preparationTime: 15
      }
    });

    console.log(`   ✅ Created menu item: ${menuItem.name} ($${menuItem.basePrice})\n`);

    // 5. Link customization groups to the menu item
    console.log('5️⃣ Linking customization groups to menu item...');
    
    const customizationLinks = [
      { groupId: sideChoiceGroup.id, sortOrder: 1 },
      { groupId: saladChoiceGroup.id, sortOrder: 2 },
      { groupId: sauceSelectionGroup.id, sortOrder: 3 }
    ];

    for (const link of customizationLinks) {
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItem.id,
          customizationGroupId: link.groupId,
          sortOrder: link.sortOrder
        }
      });
    }

    console.log(`   ✅ Linked ${customizationLinks.length} customization groups\n`);

    // 6. Display the complete setup
    console.log('🎉 CHICKEN FINGER PLATTER CREATED SUCCESSFULLY!\n');
    console.log('📋 CUSTOMIZATION BREAKDOWN:');
    console.log('═══════════════════════════════════════════════════════════');
    
    console.log('\n🍗 Menu Item:');
    console.log(`   • Name: ${menuItem.name}`);
    console.log(`   • Description: ${menuItem.description}`);
    console.log(`   • Base Price: $${menuItem.basePrice}`);
    console.log(`   • Category: ${dinnerPlatesCategory.name}`);

    console.log('\n🎛️ Customization Groups:');
    
    console.log('\n   1️⃣ SIDE CHOICE (Required, Single Select):');
    console.log('      • French Fries & Onion Rings (+$0.00) [DEFAULT]');
    console.log('      • All French Fries (+$0.00)');
    console.log('      • All Onion Rings (+$2.00)');

    console.log('\n   2️⃣ SALAD CHOICE (Required, Single Select):');
    console.log('      • Pasta Salad (+$0.00) [DEFAULT]');
    console.log('      • Cole Slaw (+$0.00)');

    console.log('\n   3️⃣ SAUCE SELECTION (Optional, Multi Select, Max 5):');
    console.log('      • BBQ Sauce (+$0.00)');
    console.log('      • Hot Sauce (+$0.00)');
    console.log('      • Honey Mustard (+$0.00)');
    console.log('      • Duck Sauce (+$0.00)');
    console.log('      • Ranch Dressing (+$0.00)');

    console.log('\n💰 PRICING EXAMPLES:');
    console.log('   • Basic (Fries & Rings + Pasta Salad): $14.99');
    console.log('   • With All Onion Rings + Cole Slaw: $16.99');
    console.log('   • With sauces (any combination): Same price');

    console.log('\n🎯 HOW THE CUSTOMIZATION SYSTEM WORKS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('1. Customer sees the menu item in Dinner Plates category');
    console.log('2. When they click to customize, they get 3 sections:');
    console.log('   a) Side Choice - Must pick one (required)');
    console.log('   b) Salad Choice - Must pick one (required)');
    console.log('   c) Sauce Selection - Can pick 0-5 (optional)');
    console.log('3. Price updates in real-time based on selections');
    console.log('4. Order gets saved with all customization details');

  } catch (error) {
    console.error('❌ Error creating Chicken Finger Platter:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChickenFingerPlatter();
