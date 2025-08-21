const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMenuCategories() {
  try {
    console.log('🍽️ Seeding menu categories and items...\n');

    // Create menu categories
    const categories = [
      {
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Fresh made sandwiches with premium ingredients',
        sortOrder: 1
      },
      {
        name: 'Burgers',
        slug: 'burgers', 
        description: 'Juicy grilled burgers with all the fixings',
        sortOrder: 2
      },
      {
        name: 'Cold Subs',
        slug: 'cold-subs',
        description: 'Fresh cold submarine sandwiches',
        sortOrder: 3
      },
      {
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: 'Complete dinner meals with sides',
        sortOrder: 4
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await prisma.menuCategory.findUnique({
        where: { slug: categoryData.slug }
      });

      if (!existingCategory) {
        const category = await prisma.menuCategory.create({
          data: categoryData
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
      }
    }

    // Get the created categories
    const sandwichesCategory = await prisma.menuCategory.findUnique({ where: { slug: 'sandwiches' } });
    const burgersCategory = await prisma.menuCategory.findUnique({ where: { slug: 'burgers' } });
    const coldSubsCategory = await prisma.menuCategory.findUnique({ where: { slug: 'cold-subs' } });
    const dinnerPlatesCategory = await prisma.menuCategory.findUnique({ where: { slug: 'dinner-plates' } });

    // Create menu items for each category
    const menuItems = [
      // Sandwiches
      {
        categoryId: sandwichesCategory.id,
        name: 'Grilled Chicken Sandwich',
        description: 'Tender grilled chicken breast with lettuce, tomato, and mayo on a toasted bun',
        basePrice: 9.99,
        preparationTime: 12,
        sortOrder: 1
      },
      {
        categoryId: sandwichesCategory.id,
        name: 'Italian Club',
        description: 'Ham, salami, pepperoni, provolone cheese, lettuce, tomato, and Italian dressing',
        basePrice: 11.49,
        preparationTime: 8,
        sortOrder: 2
      },
      {
        categoryId: sandwichesCategory.id,
        name: 'Turkey & Avocado',
        description: 'Sliced turkey, fresh avocado, bacon, lettuce, tomato, and ranch dressing',
        basePrice: 10.99,
        preparationTime: 10,
        sortOrder: 3
      },

      // Burgers
      {
        categoryId: burgersCategory.id,
        name: 'Classic Cheeseburger',
        description: '1/3 lb beef patty with American cheese, lettuce, tomato, onion, and our special sauce',
        basePrice: 12.99,
        preparationTime: 15,
        sortOrder: 1
      },
      {
        categoryId: burgersCategory.id,
        name: 'Bacon Swiss Burger',
        description: '1/3 lb beef patty with Swiss cheese, crispy bacon, mushrooms, and mayo',
        basePrice: 14.49,
        preparationTime: 18,
        sortOrder: 2
      },
      {
        categoryId: burgersCategory.id,
        name: 'BBQ Ranch Burger',
        description: '1/3 lb beef patty with cheddar cheese, onion rings, BBQ sauce, and ranch dressing',
        basePrice: 13.99,
        preparationTime: 16,
        sortOrder: 3
      },

      // Cold Subs
      {
        categoryId: coldSubsCategory.id,
        name: 'Italian Sub',
        description: 'Ham, salami, pepperoni, provolone, lettuce, tomato, onion, oil & vinegar on fresh sub roll',
        basePrice: 8.99,
        preparationTime: 5,
        sortOrder: 1
      },
      {
        categoryId: coldSubsCategory.id,
        name: 'Turkey & Cheese Sub',
        description: 'Sliced turkey, provolone cheese, lettuce, tomato, and mayo on fresh sub roll',
        basePrice: 8.49,
        preparationTime: 5,
        sortOrder: 2
      },
      {
        categoryId: coldSubsCategory.id,
        name: 'Veggie Deluxe Sub',
        description: 'Fresh vegetables, avocado, sprouts, cucumber, and hummus on whole wheat sub roll',
        basePrice: 7.99,
        preparationTime: 5,
        sortOrder: 3
      },

      // Dinner Plates
      {
        categoryId: dinnerPlatesCategory.id,
        name: 'Grilled Chicken Dinner',
        description: 'Seasoned grilled chicken breast with choice of two sides and dinner roll',
        basePrice: 15.99,
        preparationTime: 25,
        sortOrder: 1
      },
      {
        categoryId: dinnerPlatesCategory.id,
        name: 'Fish & Chips',
        description: 'Beer-battered cod with crispy fries, coleslaw, and tartar sauce',
        basePrice: 16.49,
        preparationTime: 20,
        sortOrder: 2
      },
      {
        categoryId: dinnerPlatesCategory.id,
        name: 'Pasta Primavera',
        description: 'Fresh pasta with seasonal vegetables, garlic, and parmesan cheese',
        basePrice: 13.99,
        preparationTime: 18,
        sortOrder: 3
      }
    ];

    for (const itemData of menuItems) {
      const existingItem = await prisma.menuItem.findFirst({
        where: { 
          name: itemData.name,
          categoryId: itemData.categoryId 
        }
      });

      if (!existingItem) {
        const item = await prisma.menuItem.create({
          data: itemData
        });
        console.log(`✅ Created menu item: ${item.name} ($${item.basePrice})`);
      } else {
        console.log(`⏭️  Menu item already exists: ${itemData.name}`);
      }
    }

    // Create some basic customization groups for these menu items
    const customizationGroups = [
      {
        name: 'Bread Choice',
        description: 'Choose your bread type',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      },
      {
        name: 'Cheese Options',
        description: 'Add cheese to your item',
        type: 'SINGLE_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 2
      },
      {
        name: 'Sides',
        description: 'Choose your side dishes',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 2,
        sortOrder: 3
      }
    ];

    for (const groupData of customizationGroups) {
      const existingGroup = await prisma.customizationGroup.findFirst({
        where: { name: groupData.name }
      });

      if (!existingGroup) {
        const group = await prisma.customizationGroup.create({
          data: groupData
        });
        console.log(`✅ Created customization group: ${group.name}`);

        // Add some options for each group
        if (group.name === 'Bread Choice') {
          const breadOptions = [
            { name: 'White Bread', priceModifier: 0.0, isDefault: true },
            { name: 'Wheat Bread', priceModifier: 0.0 },
            { name: 'Sourdough', priceModifier: 0.5 },
            { name: 'Ciabatta', priceModifier: 1.0 }
          ];

          for (const option of breadOptions) {
            await prisma.customizationOption.create({
              data: {
                groupId: group.id,
                ...option,
                sortOrder: breadOptions.indexOf(option)
              }
            });
          }
        }

        if (group.name === 'Cheese Options') {
          const cheeseOptions = [
            { name: 'American Cheese', priceModifier: 1.0 },
            { name: 'Swiss Cheese', priceModifier: 1.0 },
            { name: 'Cheddar Cheese', priceModifier: 1.0 },
            { name: 'Provolone Cheese', priceModifier: 1.0 }
          ];

          for (const option of cheeseOptions) {
            await prisma.customizationOption.create({
              data: {
                groupId: group.id,
                ...option,
                sortOrder: cheeseOptions.indexOf(option)
              }
            });
          }
        }

        if (group.name === 'Sides') {
          const sideOptions = [
            { name: 'French Fries', priceModifier: 2.99 },
            { name: 'Onion Rings', priceModifier: 3.49 },
            { name: 'Coleslaw', priceModifier: 2.49 },
            { name: 'Potato Salad', priceModifier: 2.99 },
            { name: 'Side Salad', priceModifier: 3.99 }
          ];

          for (const option of sideOptions) {
            await prisma.customizationOption.create({
              data: {
                groupId: group.id,
                ...option,
                sortOrder: sideOptions.indexOf(option)
              }
            });
          }
        }
      }
    }

    console.log('\n🎉 Menu categories and items seeding completed successfully!');
    
    // Show summary
    const totalCategories = await prisma.menuCategory.count();
    const totalMenuItems = await prisma.menuItem.count();
    const totalCustomizationGroups = await prisma.customizationGroup.count();
    
    console.log(`\n📊 Summary:`);
    console.log(`   📂 Categories: ${totalCategories}`);
    console.log(`   🍽️ Menu Items: ${totalMenuItems}`);
    console.log(`   ⚙️ Customization Groups: ${totalCustomizationGroups}`);

  } catch (error) {
    console.error('❌ Error seeding menu categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMenuCategories();
