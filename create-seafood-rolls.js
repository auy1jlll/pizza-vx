const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSeaFoodRollsCategory() {
  try {
    console.log('🦞 Creating Sea Food Rolls Category and Items...\n');

    // First, check if category already exists
    const existingCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { slug: 'sea-food-rolls' },
          { slug: 'seafood-rolls' },
          { name: { contains: 'Sea Food Rolls', mode: 'insensitive' } },
          { name: { contains: 'Seafood Rolls', mode: 'insensitive' } }
        ]
      }
    });

    let category;
    if (existingCategory) {
      console.log(`📁 Found existing category: ${existingCategory.name} (${existingCategory.slug})`);
      category = existingCategory;
    } else {
      // Find the highest sort order to continue from there
      const categories = await prisma.menuCategory.findMany({
        orderBy: { sortOrder: 'desc' },
        take: 1
      });
      const maxSortOrder = categories.length > 0 ? categories[0].sortOrder : 0;

      // Create the new category
      category = await prisma.menuCategory.create({
        data: {
          name: 'Sea Food Rolls',
          slug: 'sea-food-rolls',
          description: 'Fresh seafood rolls served with fries or onion rings',
          isActive: true,
          sortOrder: maxSortOrder + 1
        }
      });

      console.log(`✅ Created new category: ${category.name} (${category.slug})`);
    }

    // Define the seafood roll items
    const seafoodRollItems = [
      {
        name: 'Native Clams Roll',
        description: 'Fresh native clams in a toasted roll, served with fries or onion rings',
        basePrice: 3200, // $32.00
        preparationTime: 12,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Scallop Roll',
        description: 'Sweet sea scallops in a toasted roll, served with fries or onion rings',
        basePrice: 3200, // $32.00
        preparationTime: 12,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Strip Clams Roll',
        description: 'Tender strip clams in a toasted roll, served with fries or onion rings',
        basePrice: 1750, // $17.50
        preparationTime: 10,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Shrimp Roll',
        description: 'Fresh shrimp in a toasted roll, served with fries or onion rings',
        basePrice: 1950, // $19.50
        preparationTime: 10,
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Lobster Roll',
        description: 'Fresh lobster meat in a toasted roll, served with fries or onion rings (seasonal availability)',
        basePrice: 4000, // $40.00
        preparationTime: 15,
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'Tuna Roll',
        description: 'Fresh tuna salad in a toasted roll, served with fries or onion rings',
        basePrice: 1299, // $12.99
        preparationTime: 8,
        isActive: true,
        sortOrder: 6
      },
      {
        name: 'Crab Meat Roll',
        description: 'Fresh crab meat in a toasted roll, served with fries or onion rings',
        basePrice: 1299, // $12.99
        preparationTime: 10,
        isActive: true,
        sortOrder: 7
      }
    ];

    console.log('\n🔄 Creating seafood roll items...');

    for (const item of seafoodRollItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: category.id
        }
      });

      if (existingItem) {
        console.log(`⚠️  ${item.name} already exists, skipping...`);
        continue;
      }

      const createdItem = await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: category.id
        }
      });

      console.log(`✅ Created: ${createdItem.name} - $${(createdItem.basePrice / 100).toFixed(2)}`);
    }

    // Get the category with all items
    const finalCategory = await prisma.menuCategory.findUnique({
      where: { id: category.id },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n📋 Final Sea Food Rolls Menu:');
    console.log(`📁 Category: ${finalCategory.name}`);
    console.log(`📊 Total items: ${finalCategory.menuItems.length}`);
    console.log('\nItems:');
    finalCategory.menuItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - $${(item.basePrice / 100).toFixed(2)}`);
      console.log(`     ${item.description}`);
      console.log(`     ⏱️  ${item.preparationTime} min | ${item.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log('');
    });

    // Also create customization groups for side choices
    console.log('🍟 Creating side choice customization group...');
    
    // Check if customization group already exists
    const existingSideGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Side Choice',
        categoryId: category.id
      }
    });

    if (!existingSideGroup) {
      const sideGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Side Choice',
          description: 'Choose your side',
          type: 'SINGLE_SELECT',
          isRequired: true,
          sortOrder: 1,
          categoryId: category.id
        }
      });

      // Add side options
      const sideOptions = [
        { name: 'French Fries', description: 'Crispy golden fries', priceModifier: 0, sortOrder: 1 },
        { name: 'Onion Rings', description: 'Beer-battered onion rings', priceModifier: 0, sortOrder: 2 }
      ];

      for (const option of sideOptions) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: sideGroup.id
          }
        });
      }

      console.log(`✅ Created customization group: ${sideGroup.name} with ${sideOptions.length} options`);

      // Link the customization group to all items in the category
      for (const item of finalCategory.menuItems) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sideGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
      }

      console.log('✅ Linked side choices to all seafood roll items');
    } else {
      console.log('⚠️  Side choice customization group already exists');
    }

    console.log('\n🎉 Sea Food Rolls category and items created successfully!');
    console.log('📍 Access at: /menu/sea-food-rolls');

  } catch (error) {
    console.error('❌ Error creating Sea Food Rolls category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeaFoodRollsCategory();
