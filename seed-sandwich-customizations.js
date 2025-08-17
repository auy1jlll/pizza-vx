// Seed sandwich customization options
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSandwichCustomizations() {
  console.log('🥪 Seeding Sandwich Customization Options...\n');

  try {
    // Get the Sandwiches category
    const sandwichCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichCategory) {
      console.log('❌ Sandwiches category not found. Please run menu seeding first.');
      return;
    }

    console.log('✅ Found Sandwiches category:', sandwichCategory.name);

    // Clear existing customization data for sandwiches
    console.log('\n🧹 Cleaning up existing customization data...');
    
    const existingGroups = await prisma.customizationGroup.findMany({
      where: { categoryId: sandwichCategory.id }
    });

    for (const group of existingGroups) {
      await prisma.customizationOption.deleteMany({
        where: { groupId: group.id }
      });
      await prisma.menuItemCustomization.deleteMany({
        where: { customizationGroupId: group.id }
      });
    }

    await prisma.customizationGroup.deleteMany({
      where: { categoryId: sandwichCategory.id }
    });

    // 1. Create Size customization group
    console.log('\n1️⃣ Creating Size options...');
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Size',
        description: 'Choose your sandwich size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    const sizeOptions = [
      { name: '6"', description: '6 inch sandwich', priceModifier: 0, isDefault: true, sortOrder: 1 },
      { name: '12"', description: '12 inch sandwich', priceModifier: 4.00, isDefault: false, sortOrder: 2 },
      { name: 'Wrap', description: 'Served in a tortilla wrap', priceModifier: 0.50, isDefault: false, sortOrder: 3 }
    ];

    for (const option of sizeOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: sizeGroup.id
        }
      });
    }

    console.log(`   ✅ Created ${sizeOptions.length} size options`);

    // 2. Create Bread customization group
    console.log('\n2️⃣ Creating Bread options...');
    const breadGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Bread',
        description: 'Choose your bread type',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        isActive: true
      }
    });

    const breadOptions = [
      { name: 'White', description: 'Classic white bread', priceModifier: 0, isDefault: true, sortOrder: 1 },
      { name: 'Wheat', description: 'Whole wheat bread', priceModifier: 0, isDefault: false, sortOrder: 2 },
      { name: 'Italian Herb', description: 'Italian herbs & cheese', priceModifier: 0.75, isDefault: false, sortOrder: 3 },
      { name: 'Sourdough', description: 'Tangy sourdough bread', priceModifier: 0.50, isDefault: false, sortOrder: 4 },
      { name: 'Ciabatta', description: 'Fresh ciabatta roll', priceModifier: 1.00, isDefault: false, sortOrder: 5 }
    ];

    for (const option of breadOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: breadGroup.id
        }
      });
    }

    console.log(`   ✅ Created ${breadOptions.length} bread options`);

    // 3. Create Cheese customization group
    console.log('\n3️⃣ Creating Cheese options...');
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Cheese',
        description: 'Add cheese to your sandwich',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 3,
        sortOrder: 3,
        isActive: true
      }
    });

    const cheeseOptions = [
      { name: 'American', description: 'Classic American cheese', priceModifier: 1.00, isDefault: false, sortOrder: 1 },
      { name: 'Provolone', description: 'Mild provolone cheese', priceModifier: 1.25, isDefault: false, sortOrder: 2 },
      { name: 'Swiss', description: 'Swiss cheese', priceModifier: 1.25, isDefault: false, sortOrder: 3 },
      { name: 'Cheddar', description: 'Sharp cheddar cheese', priceModifier: 1.25, isDefault: false, sortOrder: 4 },
      { name: 'Pepper Jack', description: 'Spicy pepper jack cheese', priceModifier: 1.50, isDefault: false, sortOrder: 5 }
    ];

    for (const option of cheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: cheeseGroup.id,
          maxQuantity: 2
        }
      });
    }

    console.log(`   ✅ Created ${cheeseOptions.length} cheese options`);

    // 4. Create Vegetables customization group
    console.log('\n4️⃣ Creating Vegetable options...');
    const veggieGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Vegetables',
        description: 'Add fresh vegetables',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null, // unlimited
        sortOrder: 4,
        isActive: true
      }
    });

    const veggieOptions = [
      { name: 'Lettuce', description: 'Fresh iceberg lettuce', priceModifier: 0, isDefault: true, sortOrder: 1 },
      { name: 'Tomatoes', description: 'Fresh sliced tomatoes', priceModifier: 0, isDefault: true, sortOrder: 2 },
      { name: 'Onions', description: 'Fresh red onions', priceModifier: 0, isDefault: false, sortOrder: 3 },
      { name: 'Pickles', description: 'Dill pickle slices', priceModifier: 0, isDefault: false, sortOrder: 4 },
      { name: 'Green Peppers', description: 'Fresh green bell peppers', priceModifier: 0.50, isDefault: false, sortOrder: 5 },
      { name: 'Mushrooms', description: 'Fresh mushrooms', priceModifier: 0.75, isDefault: false, sortOrder: 6 },
      { name: 'Avocado', description: 'Fresh sliced avocado', priceModifier: 2.00, isDefault: false, sortOrder: 7 },
      { name: 'Spinach', description: 'Fresh baby spinach', priceModifier: 0.50, isDefault: false, sortOrder: 8 }
    ];

    for (const option of veggieOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: veggieGroup.id,
          maxQuantity: 3
        }
      });
    }

    console.log(`   ✅ Created ${veggieOptions.length} vegetable options`);

    // 5. Create Condiments customization group
    console.log('\n5️⃣ Creating Condiment options...');
    const condimentGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Condiments',
        description: 'Add sauces and condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 4,
        sortOrder: 5,
        isActive: true
      }
    });

    const condimentOptions = [
      { name: 'Mayo', description: 'Classic mayonnaise', priceModifier: 0, isDefault: false, sortOrder: 1 },
      { name: 'Mustard', description: 'Yellow mustard', priceModifier: 0, isDefault: false, sortOrder: 2 },
      { name: 'Italian Dressing', description: 'Zesty Italian dressing', priceModifier: 0, isDefault: false, sortOrder: 3 },
      { name: 'Ranch', description: 'Creamy ranch dressing', priceModifier: 0.25, isDefault: false, sortOrder: 4 },
      { name: 'Chipotle Mayo', description: 'Spicy chipotle mayonnaise', priceModifier: 0.50, isDefault: false, sortOrder: 5 },
      { name: 'Pesto', description: 'Basil pesto spread', priceModifier: 0.75, isDefault: false, sortOrder: 6 },
      { name: 'Hot Sauce', description: 'Spicy hot sauce', priceModifier: 0, isDefault: false, sortOrder: 7 }
    ];

    for (const option of condimentOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: condimentGroup.id,
          maxQuantity: 2
        }
      });
    }

    console.log(`   ✅ Created ${condimentOptions.length} condiment options`);

    // 6. Create Extras customization group
    console.log('\n6️⃣ Creating Extra options...');
    const extrasGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Extras',
        description: 'Premium add-ons',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 6,
        isActive: true
      }
    });

    const extrasOptions = [
      { name: 'Extra Meat', description: 'Double the protein', priceModifier: 3.00, isDefault: false, sortOrder: 1 },
      { name: 'Bacon', description: 'Crispy bacon strips', priceModifier: 2.50, isDefault: false, sortOrder: 2 },
      { name: 'Toasted', description: 'Toast your sandwich', priceModifier: 0, isDefault: false, sortOrder: 3 },
      { name: 'Make it a Combo', description: 'Add chips and drink', priceModifier: 3.99, isDefault: false, sortOrder: 4 }
    ];

    for (const option of extrasOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: extrasGroup.id,
          maxQuantity: option.name === 'Extra Meat' ? 2 : 1
        }
      });
    }

    console.log(`   ✅ Created ${extrasOptions.length} extra options`);

    // 7. Link customization groups to all sandwich menu items
    console.log('\n7️⃣ Linking customization groups to sandwich menu items...');
    
    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichCategory.id }
    });

    const customizationGroups = [sizeGroup, breadGroup, cheeseGroup, veggieGroup, condimentGroup, extrasGroup];

    for (const item of sandwichItems) {
      for (let i = 0; i < customizationGroups.length; i++) {
        const group = customizationGroups[i];
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: group.id,
            isRequired: group.isRequired,
            sortOrder: i + 1
          }
        });
      }
    }

    console.log(`   ✅ Linked customization groups to ${sandwichItems.length} sandwich items`);

    console.log('\n🎉 Sandwich customization seeding completed successfully!');

    // Show summary
    console.log('\n📊 Summary:');
    console.log(`   - ${customizationGroups.length} customization groups created`);
    console.log(`   - Size options: ${sizeOptions.length}`);
    console.log(`   - Bread options: ${breadOptions.length}`);
    console.log(`   - Cheese options: ${cheeseOptions.length}`);
    console.log(`   - Vegetable options: ${veggieOptions.length}`);
    console.log(`   - Condiment options: ${condimentOptions.length}`);
    console.log(`   - Extra options: ${extrasOptions.length}`);
    console.log(`   - Linked to ${sandwichItems.length} sandwich menu items`);

  } catch (error) {
    console.error('❌ Error seeding sandwich customizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSandwichCustomizations();
