const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createChickenFingerPlatter() {
  try {
    console.log('🍗 Creating Chicken Finger Platter with customization options...\n');

    // First, get the dinner-plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'dinner-plates' }
    });

    if (!dinnerPlatesCategory) {
      console.error('❌ Dinner Plates category not found!');
      return;
    }

    console.log(`✅ Found Dinner Plates category: ${dinnerPlatesCategory.name}`);

    // Create the chicken finger platter menu item
    const chickenPlatter = await prisma.menuItem.create({
      data: {
        name: 'Chicken Finger Platter',
        description: 'Crispy chicken fingers served with your choice of sides and sauces',
        basePrice: 14.99,
        categoryId: dinnerPlatesCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 1,
        preparationTime: 15
      }
    });

    console.log(`✅ Created menu item: ${chickenPlatter.name} - $${chickenPlatter.basePrice}`);

    // Create customization groups for this item
    console.log('\n🎛️ Creating customization groups...\n');

    // 1. Side Choice Group
    const sideChoiceGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Side Choice',
        description: 'Choose your preferred side',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true,
        categoryId: dinnerPlatesCategory.id,
        options: {
          create: [
            {
              name: 'French Fries',
              description: 'Crispy golden french fries',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: true,
              isActive: true,
              sortOrder: 1
            },
            {
              name: 'Onion Rings',
              description: 'Crispy battered onion rings',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 2
            },
            {
              name: 'Half Fries, Half Onion Rings',
              description: 'Mix of french fries and onion rings',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 3
            }
          ]
        }
      },
      include: {
        options: true
      }
    });

    console.log(`✅ Created Side Choice group with ${sideChoiceGroup.options.length} options`);

    // 2. Salad Choice Group
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
        categoryId: dinnerPlatesCategory.id,
        options: {
          create: [
            {
              name: 'Pasta Salad',
              description: 'Fresh pasta salad with vegetables',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: true,
              isActive: true,
              sortOrder: 1
            },
            {
              name: 'Coleslaw',
              description: 'Creamy coleslaw with cabbage and carrots',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 2
            }
          ]
        }
      },
      include: {
        options: true
      }
    });

    console.log(`✅ Created Salad Choice group with ${saladChoiceGroup.options.length} options`);

    // 3. Sauce Selection Group
    const sauceSelectionGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Sauce Selection',
        description: 'Choose your dipping sauces',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 3,
        sortOrder: 3,
        isActive: true,
        categoryId: dinnerPlatesCategory.id,
        options: {
          create: [
            {
              name: 'Honey Mustard',
              description: 'Sweet and tangy honey mustard sauce',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 1
            },
            {
              name: 'BBQ Sauce',
              description: 'Smoky barbecue sauce',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 2
            },
            {
              name: 'Ranch Dressing',
              description: 'Creamy ranch dressing',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 3
            },
            {
              name: 'Buffalo Sauce',
              description: 'Spicy buffalo sauce',
              priceModifier: 0.00,
              priceType: 'FLAT',
              isDefault: false,
              isActive: true,
              sortOrder: 4
            }
          ]
        }
      },
      include: {
        options: true
      }
    });

    console.log(`✅ Created Sauce Selection group with ${sauceSelectionGroup.options.length} options`);

    // Link the customization groups to the menu item
    await prisma.menuItemCustomization.createMany({
      data: [
        {
          menuItemId: chickenPlatter.id,
          customizationGroupId: sideChoiceGroup.id,
          isRequired: true,
          sortOrder: 1
        },
        {
          menuItemId: chickenPlatter.id,
          customizationGroupId: saladChoiceGroup.id,
          isRequired: true,
          sortOrder: 2
        },
        {
          menuItemId: chickenPlatter.id,
          customizationGroupId: sauceSelectionGroup.id,
          isRequired: false,
          sortOrder: 3
        }
      ]
    });

    console.log('\n✅ Linked all customization groups to the menu item');

    // Verify the creation
    const verifyItem = await prisma.menuItem.findUnique({
      where: { id: chickenPlatter.id },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n🎉 CHICKEN FINGER PLATTER CREATED SUCCESSFULLY!\n');
    console.log(`📋 Menu Item: ${verifyItem.name}`);
    console.log(`💰 Price: $${verifyItem.basePrice}`);
    console.log(`📂 Category: ${verifyItem.category.name}`);
    console.log(`🛠️ Customization Groups: ${verifyItem.customizationGroups.length}`);

    verifyItem.customizationGroups.forEach((relation, index) => {
      const group = relation.customizationGroup;
      console.log(`\n${index + 1}. ${group.name} (${group.type}) - ${group.isRequired ? 'Required' : 'Optional'}`);
      console.log(`   Options: ${group.options.length}`);
      group.options.forEach((option, optIndex) => {
        console.log(`   ${optIndex + 1}. ${option.name}${option.isDefault ? ' (default)' : ''}`);
      });
    });

    console.log('\n🌐 You can now visit: http://localhost:3005/menu/dinner-plates');
    console.log('   to see the Chicken Finger Platter with all customization options!');

  } catch (error) {
    console.error('❌ Error creating chicken finger platter:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChickenFingerPlatter();
