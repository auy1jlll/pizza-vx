const { PrismaClient } = require('@prisma/client');

async function addChickenFingerPlatter() {
  const prisma = new PrismaClient();

  try {
    console.log('🍗 Creating Chicken Finger Platter with customizations...\n');

    // 1. First, find the dinner-plates category
    const dinnerPlatesCategory = await prisma.category.findFirst({
      where: { slug: 'dinner-plates' }
    });

    if (!dinnerPlatesCategory) {
      console.log('❌ Dinner plates category not found!');
      return;
    }

    console.log(`✅ Found category: ${dinnerPlatesCategory.name} (ID: ${dinnerPlatesCategory.id})\n`);

    // 2. Check if item already exists
    const existingItem = await prisma.menuItem.findFirst({
      where: { 
        name: 'Chicken Finger Platter',
        categoryId: dinnerPlatesCategory.id 
      }
    });

    if (existingItem) {
      console.log('⚠️ Chicken Finger Platter already exists!');
      console.log(`   ID: ${existingItem.id}, Price: $${existingItem.basePrice}`);
      return;
    }

    // 3. Create the menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        name: 'Chicken Finger Platter',
        description: 'Crispy chicken fingers served with your choice of sides, salad, and dipping sauces',
        basePrice: 14.99,
        categoryId: dinnerPlatesCategory.id,
        isActive: true,
        sortOrder: 10,
        preparationTime: 15
      }
    });

    console.log('✅ Created menu item:');
    console.log(`   Name: ${menuItem.name}`);
    console.log(`   Price: $${menuItem.basePrice}`);
    console.log(`   ID: ${menuItem.id}\n`);

    // 4. Create Side Choice customization group
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

    // Add side options
    const sideOptions = [
      { name: 'French Fries & Onion Rings', price: 0.00, isDefault: true },
      { name: 'All French Fries', price: 0.00, isDefault: false },
      { name: 'All Onion Rings', price: 2.00, isDefault: false }
    ];

    for (const [index, option] of sideOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: option.name,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: option.isDefault,
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: sideChoiceGroup.id
        }
      });
    }

    console.log(`✅ Created "Side Choice" group with ${sideOptions.length} options`);

    // 5. Create Salad Choice customization group
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

    // Add salad options
    const saladOptions = [
      { name: 'Pasta Salad', price: 0.00, isDefault: true },
      { name: 'Cole Slaw', price: 0.00, isDefault: false }
    ];

    for (const [index, option] of saladOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: option.name,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: option.isDefault,
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: saladChoiceGroup.id
        }
      });
    }

    console.log(`✅ Created "Salad Choice" group with ${saladOptions.length} options`);

    // 6. Create Sauce Selection customization group
    const sauceGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Sauce Selection',
        description: 'Choose your dipping sauces (multiple allowed)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 5,
        sortOrder: 3,
        isActive: true,
        categoryId: dinnerPlatesCategory.id
      }
    });

    // Add sauce options
    const sauceOptions = [
      'BBQ Sauce',
      'Hot Sauce', 
      'Honey Mustard',
      'Duck Sauce',
      'Ranch Dressing'
    ];

    for (const [index, sauceName] of sauceOptions.entries()) {
      await prisma.customizationOption.create({
        data: {
          name: sauceName,
          priceModifier: 0.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: index + 1,
          customizationGroupId: sauceGroup.id
        }
      });
    }

    console.log(`✅ Created "Sauce Selection" group with ${sauceOptions.length} options`);

    // 7. Link customization groups to menu item
    const groupLinks = [
      { groupId: sideChoiceGroup.id, sortOrder: 1 },
      { groupId: saladChoiceGroup.id, sortOrder: 2 },
      { groupId: sauceGroup.id, sortOrder: 3 }
    ];

    for (const link of groupLinks) {
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItem.id,
          customizationGroupId: link.groupId,
          sortOrder: link.sortOrder
        }
      });
    }

    console.log(`✅ Linked ${groupLinks.length} customization groups to menu item\n`);

    console.log('🎉 SUCCESS! Chicken Finger Platter created with full customizations!');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('🌐 View it at: http://localhost:3005/menu/dinner-plates');
    console.log('🛠️ Admin: http://localhost:3005/admin/menu-manager/customizations');
    console.log('');
    console.log('📋 WHAT WAS CREATED:');
    console.log('• Menu Item: Chicken Finger Platter ($14.99)');
    console.log('• Side Choice: 3 options (Fries & Rings, All Fries, All Onion Rings +$2)');
    console.log('• Salad Choice: 2 options (Pasta Salad, Cole Slaw)');
    console.log('• Sauce Selection: 5 options (all free, pick multiple)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addChickenFingerPlatter();
