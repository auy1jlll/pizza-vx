// Seed script for new menu categories
const { PrismaClient } = require('@prisma/client');

async function seedMenuCategories() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting to seed menu categories...');
    
    // 1. Create Menu Categories
    console.log('📝 Creating menu categories...');
    const categories = [
      {
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Fresh made sandwiches and subs',
        sortOrder: 1
      },
      {
        name: 'Salads',
        slug: 'salads',
        description: 'Fresh garden salads and specialty salads',
        sortOrder: 2
      },
      {
        name: 'Seafood',
        slug: 'seafood',
        description: 'Fresh seafood dishes',
        sortOrder: 3
      },
      {
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: 'Complete dinner meals with sides',
        sortOrder: 4
      }
    ];

    const createdCategories = {};
    for (const category of categories) {
      try {
        const created = await prisma.menuCategory.create({ data: category });
        createdCategories[category.slug] = created;
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Category ${category.name} already exists, fetching...`);
          const existing = await prisma.menuCategory.findUnique({
            where: { slug: category.slug }
          });
          createdCategories[category.slug] = existing;
        } else {
          throw error;
        }
      }
    }

    // 2. Create Customization Groups
    console.log('🔧 Creating customization groups...');
    
    // Size customization group (for sandwiches, salads)
    const sizeGroup = await prisma.customizationGroup.upsert({
      where: { id: 'size-group-general' },
      update: {},
      create: {
        id: 'size-group-general',
        name: 'Size',
        description: 'Choose your size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Size options
    const sizeOptions = [
      { name: 'Small', priceModifier: 0, sortOrder: 1, isDefault: true },
      { name: 'Medium', priceModifier: 2.00, sortOrder: 2 },
      { name: 'Large', priceModifier: 4.00, sortOrder: 3 }
    ];

    for (const option of sizeOptions) {
      await prisma.customizationOption.upsert({
        where: { id: `size-${option.name.toLowerCase()}` },
        update: {},
        create: {
          id: `size-${option.name.toLowerCase()}`,
          groupId: sizeGroup.id,
          ...option
        }
      });
    }

    // Sandwich-specific customization groups
    const sandwichGroups = [
      {
        id: 'sandwich-bread',
        name: 'Bread Type',
        description: 'Choose your bread',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        categoryId: createdCategories['sandwiches'].id
      },
      {
        id: 'sandwich-condiments',
        name: 'Condiments',
        description: 'Choose your condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3,
        categoryId: createdCategories['sandwiches'].id
      },
      {
        id: 'sandwich-toppings',
        name: 'Toppings',
        description: 'Add toppings',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4,
        categoryId: createdCategories['sandwiches'].id
      }
    ];

    for (const group of sandwichGroups) {
      await prisma.customizationGroup.upsert({
        where: { id: group.id },
        update: {},
        create: group
      });
    }

    // Bread options
    const breadOptions = [
      { name: 'White', priceModifier: 0, isDefault: true },
      { name: 'Wheat', priceModifier: 0 },
      { name: 'Italian', priceModifier: 0.50 },
      { name: 'Sourdough', priceModifier: 0.75 }
    ];

    for (let i = 0; i < breadOptions.length; i++) {
      const option = breadOptions[i];
      await prisma.customizationOption.upsert({
        where: { id: `bread-${option.name.toLowerCase()}` },
        update: {},
        create: {
          id: `bread-${option.name.toLowerCase()}`,
          groupId: 'sandwich-bread',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // Condiment options
    const condimentOptions = [
      { name: 'Mayo', priceModifier: 0 },
      { name: 'Mustard', priceModifier: 0 },
      { name: 'Oil & Vinegar', priceModifier: 0 },
      { name: 'Italian Dressing', priceModifier: 0 }
    ];

    for (let i = 0; i < condimentOptions.length; i++) {
      const option = condimentOptions[i];
      await prisma.customizationOption.upsert({
        where: { id: `condiment-${option.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}` },
        update: {},
        create: {
          id: `condiment-${option.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`,
          groupId: 'sandwich-condiments',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // Sandwich topping options
    const sandwichToppings = [
      { name: 'Lettuce', priceModifier: 0 },
      { name: 'Tomato', priceModifier: 0 },
      { name: 'Onions', priceModifier: 0 },
      { name: 'Pickles', priceModifier: 0 },
      { name: 'Extra Cheese', priceModifier: 1.50 },
      { name: 'Extra Meat', priceModifier: 3.00 }
    ];

    for (let i = 0; i < sandwichToppings.length; i++) {
      const option = sandwichToppings[i];
      await prisma.customizationOption.upsert({
        where: { id: `sandwich-topping-${option.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `sandwich-topping-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
          groupId: 'sandwich-toppings',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // Salad customization groups
    const saladGroups = [
      {
        id: 'salad-protein',
        name: 'Protein',
        description: 'Add protein to your salad',
        type: 'SINGLE_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 2,
        categoryId: createdCategories['salads'].id
      },
      {
        id: 'salad-dressing',
        name: 'Dressing',
        description: 'Choose your dressing',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 3,
        categoryId: createdCategories['salads'].id
      }
    ];

    for (const group of saladGroups) {
      await prisma.customizationGroup.upsert({
        where: { id: group.id },
        update: {},
        create: group
      });
    }

    // Protein options for salads
    const proteinOptions = [
      { name: 'Grilled Chicken', priceModifier: 4.00 },
      { name: 'Grilled Shrimp', priceModifier: 5.00 },
      { name: 'Salmon', priceModifier: 6.00 },
      { name: 'Turkey', priceModifier: 3.00 }
    ];

    for (let i = 0; i < proteinOptions.length; i++) {
      const option = proteinOptions[i];
      await prisma.customizationOption.upsert({
        where: { id: `protein-${option.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `protein-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
          groupId: 'salad-protein',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // Dressing options
    const dressingOptions = [
      { name: 'Ranch', priceModifier: 0, isDefault: true },
      { name: 'Italian', priceModifier: 0 },
      { name: 'Caesar', priceModifier: 0 },
      { name: 'Balsamic Vinaigrette', priceModifier: 0 },
      { name: 'Blue Cheese', priceModifier: 0 }
    ];

    for (let i = 0; i < dressingOptions.length; i++) {
      const option = dressingOptions[i];
      await prisma.customizationOption.upsert({
        where: { id: `dressing-${option.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `dressing-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
          groupId: 'salad-dressing',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // Dinner Plate customization (special "2 of 3" logic)
    const dinnerSidesGroup = await prisma.customizationGroup.upsert({
      where: { id: 'dinner-sides' },
      update: {},
      create: {
        id: 'dinner-sides',
        name: 'Sides (Choose 2 of 3)',
        description: 'Select 2 sides from the available options',
        type: 'SPECIAL_LOGIC',
        isRequired: true,
        minSelections: 2,
        maxSelections: 2,
        sortOrder: 2,
        categoryId: createdCategories['dinner-plates'].id
      }
    });

    // Side options for dinner plates
    const sideOptions = [
      { name: 'French Fries', priceModifier: 0 },
      { name: 'Rice Pilaf', priceModifier: 0 },
      { name: 'Steamed Vegetables', priceModifier: 0 }
    ];

    for (let i = 0; i < sideOptions.length; i++) {
      const option = sideOptions[i];
      await prisma.customizationOption.upsert({
        where: { id: `side-${option.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `side-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
          groupId: 'dinner-sides',
          sortOrder: i + 1,
          ...option
        }
      });
    }

    // 3. Create Sample Menu Items
    console.log('🍽️  Creating sample menu items...');

    // Sandwiches
    const sandwichItems = [
      {
        name: 'Italian Sub',
        description: 'Ham, salami, capicola, provolone cheese',
        basePrice: 9.99,
        categoryId: createdCategories['sandwiches'].id,
        sortOrder: 1
      },
      {
        name: 'Turkey & Cheese',
        description: 'Sliced turkey breast with your choice of cheese',
        basePrice: 8.99,
        categoryId: createdCategories['sandwiches'].id,
        sortOrder: 2
      },
      {
        name: 'Chicken Parmesan Sub',
        description: 'Breaded chicken, marinara sauce, mozzarella',
        basePrice: 10.99,
        categoryId: createdCategories['sandwiches'].id,
        sortOrder: 3
      }
    ];

    for (const item of sandwichItems) {
      const created = await prisma.menuItem.upsert({
        where: { id: `sandwich-${item.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}` },
        update: {},
        create: {
          id: `sandwich-${item.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`,
          ...item
        }
      });

      // Link to customization groups
      const groups = [sizeGroup.id, 'sandwich-bread', 'sandwich-condiments', 'sandwich-toppings'];
      for (let i = 0; i < groups.length; i++) {
        await prisma.menuItemCustomization.upsert({
          where: { 
            id: `${created.id}-${groups[i]}`
          },
          update: {},
          create: {
            id: `${created.id}-${groups[i]}`,
            menuItemId: created.id,
            customizationGroupId: groups[i],
            isRequired: i === 0 || i === 1, // Size and bread are required
            sortOrder: i + 1
          }
        });
      }
    }

    // Salads
    const saladItems = [
      {
        name: 'Garden Salad',
        description: 'Mixed greens, tomatoes, cucumbers, onions',
        basePrice: 7.99,
        categoryId: createdCategories['salads'].id,
        sortOrder: 1
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons',
        basePrice: 8.99,
        categoryId: createdCategories['salads'].id,
        sortOrder: 2
      },
      {
        name: 'Greek Salad',
        description: 'Mixed greens, feta, olives, peppers',
        basePrice: 9.99,
        categoryId: createdCategories['salads'].id,
        sortOrder: 3
      }
    ];

    for (const item of saladItems) {
      const created = await prisma.menuItem.upsert({
        where: { id: `salad-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `salad-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...item
        }
      });

      // Link to customization groups
      const groups = [sizeGroup.id, 'salad-protein', 'salad-dressing'];
      for (let i = 0; i < groups.length; i++) {
        await prisma.menuItemCustomization.upsert({
          where: { 
            id: `${created.id}-${groups[i]}`
          },
          update: {},
          create: {
            id: `${created.id}-${groups[i]}`,
            menuItemId: created.id,
            customizationGroupId: groups[i],
            isRequired: i === 0 || i === 2, // Size and dressing are required
            sortOrder: i + 1
          }
        });
      }
    }

    // Seafood
    const seafoodItems = [
      {
        name: 'Fish & Chips',
        description: 'Beer battered cod with french fries',
        basePrice: 14.99,
        categoryId: createdCategories['seafood'].id,
        sortOrder: 1
      },
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon butter',
        basePrice: 18.99,
        categoryId: createdCategories['seafood'].id,
        sortOrder: 2
      }
    ];

    for (const item of seafoodItems) {
      await prisma.menuItem.upsert({
        where: { id: `seafood-${item.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}` },
        update: {},
        create: {
          id: `seafood-${item.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`,
          ...item
        }
      });
    }

    // Dinner Plates
    const dinnerItems = [
      {
        name: 'Grilled Chicken Dinner',
        description: 'Grilled chicken breast with your choice of 2 sides',
        basePrice: 16.99,
        categoryId: createdCategories['dinner-plates'].id,
        sortOrder: 1
      },
      {
        name: 'Steak Tips',
        description: 'Marinated beef tips with your choice of 2 sides',
        basePrice: 19.99,
        categoryId: createdCategories['dinner-plates'].id,
        sortOrder: 2
      }
    ];

    for (const item of dinnerItems) {
      const created = await prisma.menuItem.upsert({
        where: { id: `dinner-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `dinner-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...item
        }
      });

      // Link to dinner sides customization
      await prisma.menuItemCustomization.upsert({
        where: { 
          id: `${created.id}-dinner-sides`
        },
        update: {},
        create: {
          id: `${created.id}-dinner-sides`,
          menuItemId: created.id,
          customizationGroupId: 'dinner-sides',
          isRequired: true,
          sortOrder: 1
        }
      });
    }

    console.log('✅ Menu categories seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${categories.length} menu categories created`);
    console.log(`   - ${sandwichItems.length} sandwich items created`);
    console.log(`   - ${saladItems.length} salad items created`);
    console.log(`   - ${seafoodItems.length} seafood items created`);
    console.log(`   - ${dinnerItems.length} dinner plate items created`);
    console.log('🎉 Ready to build multi-category menus!');
    
  } catch (error) {
    console.error('❌ Error seeding menu categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMenuCategories();
