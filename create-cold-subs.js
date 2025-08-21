const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createColdSubsCategory() {
  try {
    console.log('Creating/Overwriting Cold Subs category and menu items...');

    // Check if Cold Subs category already exists
    let coldSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Cold Subs' }
    });

    if (coldSubsCategory) {
      console.log('Found existing Cold Subs category - will overwrite items...');
      
      // Delete existing menu items in this category
      const existingItems = await prisma.menuItem.findMany({
        where: { categoryId: coldSubsCategory.id }
      });
      
      if (existingItems.length > 0) {
        console.log(`Removing ${existingItems.length} existing items...`);
        
        // Remove customization links first
        for (const item of existingItems) {
          await prisma.menuItemCustomization.deleteMany({
            where: { menuItemId: item.id }
          });
        }
        
        // Then remove the items
        await prisma.menuItem.deleteMany({
          where: { categoryId: coldSubsCategory.id }
        });
        
        console.log('✓ Existing items removed');
      }
    } else {
      console.log('Creating new Cold Subs category...');
      coldSubsCategory = await prisma.menuCategory.create({
        data: {
          name: 'Cold Subs',
          slug: 'cold-subs',
          description: 'Fresh cold submarine sandwiches made to order',
          isActive: true,
          sortOrder: 18
        }
      });
      console.log(`✓ Created Cold Subs category: ${coldSubsCategory.id}`);
    }

    // Find the existing Sub Size & Style customization group
    const subSizeStyleGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sub Size & Style' },
      include: { options: true }
    });

    if (!subSizeStyleGroup) {
      console.log('❌ Sub Size & Style customization group not found. Please create it first.');
      return;
    }

    console.log(`✓ Found Sub Size & Style customization group: ${subSizeStyleGroup.id}`);
    console.log(`   Options: ${subSizeStyleGroup.options.map(opt => opt.name).join(', ')}`);

    // Define the cold sub menu items - using base price from smallest option in Sub Size & Style
    const coldSubItems = [
      {
        name: 'Italian Sub',
        description: 'Ham, salami, pepperoni, provolone cheese, lettuce, tomatoes, onions, oil and vinegar',
        basePrice: 8.99, // Will be modified by size/style selection
        sortOrder: 1
      },
      {
        name: 'American Sub',
        description: 'Ham, turkey, American cheese, lettuce, tomatoes, and mayo',
        basePrice: 8.99,
        sortOrder: 2
      },
      {
        name: 'Imported Ham',
        description: 'Premium imported ham with cheese, lettuce, tomatoes, and condiments',
        basePrice: 8.99,
        sortOrder: 3
      },
      {
        name: 'Genoa Salami',
        description: 'Authentic Genoa salami with provolone, lettuce, tomatoes, onions, oil and vinegar',
        basePrice: 8.99,
        sortOrder: 4
      },
      {
        name: 'Tuna Salad',
        description: 'Fresh tuna salad with lettuce, tomatoes, and your choice of condiments',
        basePrice: 8.99,
        sortOrder: 5
      },
      {
        name: 'Chicken Salad',
        description: 'Homemade chicken salad with lettuce, tomatoes, and your choice of condiments',
        basePrice: 8.99,
        sortOrder: 6
      },
      {
        name: 'Crab Meat',
        description: 'Fresh crab meat with lettuce, tomatoes, and your choice of condiments',
        basePrice: 8.99,
        sortOrder: 7
      },
      {
        name: 'Veggie Sub',
        description: 'Fresh vegetables, cheese, lettuce, tomatoes, onions, peppers, and condiments',
        basePrice: 8.99,
        sortOrder: 8
      },
      {
        name: 'Turkey Sub',
        description: 'Sliced turkey breast with cheese, lettuce, tomatoes, and condiments',
        basePrice: 8.99,
        sortOrder: 9
      },
      {
        name: 'BLT Sub',
        description: 'Crispy bacon, lettuce, tomatoes, and mayo on your choice of bread',
        basePrice: 8.99,
        sortOrder: 10
      }
    ];

    console.log(`Creating ${coldSubItems.length} cold sub menu items...`);
    console.log('📋 All items will use Sub Size & Style customization for pricing');
    console.log('');

    for (const item of coldSubItems) {
      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice, // Base price - will be modified by size/style
          categoryId: coldSubsCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} – Base $${item.basePrice.toFixed(2)}`);

      // Link the Sub Size & Style customization group to this item
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: menuItem.id,
          customizationGroupId: subSizeStyleGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: subSizeStyleGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`    ✓ Linked Sub Size & Style customization group`);
      }
    }

    console.log('\n🎉 Cold Subs category and menu items created successfully!');
    console.log('\n🥪 Cold Subs - Fresh cold submarine sandwiches made to order:');
    console.log('');
    
    coldSubItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} – Starting at $${item.basePrice.toFixed(2)}`);
      console.log(`   ${item.description}`);
      console.log('');
    });

    console.log('✅ All subs linked to Sub Size & Style customization group');
    console.log('💡 Final pricing depends on customer\'s size and style selection');

  } catch (error) {
    console.error('Error creating Cold Subs category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createColdSubsCategory();
