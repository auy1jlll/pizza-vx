const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createHotSubsCategory() {
  try {
    console.log('Creating Hot Subs category...');
    
    // First, check if hot subs customization group exists, if not create it
    let hotSubsGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: { contains: 'Hot Sub', mode: 'insensitive' }
      },
      include: { options: true }
    });
    
    if (!hotSubsGroup) {
      console.log('Creating Hot Subs Size & Style customization group...');
      
      // Create the hot subs customization group with size and style options
      hotSubsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Hot Subs Size & Style',
          description: 'Choose your hot sub size and bread/wrap style',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1,
          isActive: true,
          options: {
            create: [
              {
                name: 'SM-10"',
                description: 'Small 10 inch sub',
                priceModifier: 0.0,
                priceType: 'FLAT',
                isDefault: true,
                isActive: true,
                sortOrder: 1
              },
              {
                name: 'LG 12"',
                description: 'Large 12 inch sub',
                priceModifier: 1.0,
                priceType: 'FLAT',
                isDefault: false,
                isActive: true,
                sortOrder: 2
              },
              {
                name: 'Wheat Wrap',
                description: 'Wheat tortilla wrap',
                priceModifier: 1.0,
                priceType: 'FLAT',
                isDefault: false,
                isActive: true,
                sortOrder: 3
              },
              {
                name: 'Spinach Wrap',
                description: 'Spinach tortilla wrap',
                priceModifier: 1.0,
                priceType: 'FLAT',
                isDefault: false,
                isActive: true,
                sortOrder: 4
              },
              {
                name: 'Tomato-Basil Wrap',
                description: 'Tomato-basil tortilla wrap',
                priceModifier: 1.0,
                priceType: 'FLAT',
                isDefault: false,
                isActive: true,
                sortOrder: 5
              },
              {
                name: 'White Wrap',
                description: 'White tortilla wrap',
                priceModifier: 1.0,
                priceType: 'FLAT',
                isDefault: false,
                isActive: true,
                sortOrder: 6
              }
            ]
          }
        },
        include: { options: true }
      });
      
      console.log(`Created customization group: ${hotSubsGroup.name} with ${hotSubsGroup.options.length} options`);
    } else {
      console.log(`Found existing customization group: ${hotSubsGroup.name}`);
    }
    
    // Delete existing hot subs category if it exists
    const existingCategories = await prisma.menuCategory.findMany({
      where: {
        OR: [
          { slug: 'hot-subs' },
          { name: { contains: 'Hot Sub', mode: 'insensitive' } }
        ]
      }
    });
    
    for (const category of existingCategories) {
      console.log(`Deleting existing category: ${category.name}`);
      await prisma.menuCategory.delete({
        where: { id: category.id }
      });
    }
    
    // Create the hot subs category
    const hotSubsCategory = await prisma.menuCategory.create({
      data: {
        name: 'Hot Subs',
        slug: 'hot-subs',
        description: 'Fresh made-to-order hot subs, wraps, and sandwiches',
        isActive: true,
        sortOrder: 4
      }
    });
    
    console.log(`Created category: ${hotSubsCategory.name}`);
    
    // Define the hot sub items
    const hotSubItems = [
      {
        name: 'Chicken Cutlet Sub',
        description: 'Chicken cutlet in special batter fried in a large sub roll.',
        basePrice: 12.99
      },
      {
        name: 'Grilled Chicken Kabob',
        description: 'Fresh made-to-order grilled chicken, served in your choice of wrap or sub.',
        basePrice: 12.99
      },
      {
        name: 'Steak Tips Kabob',
        description: 'Fresh made-to-order grilled steak tips, served in your choice of wrap or sub.',
        basePrice: 15.99
      },
      {
        name: 'Cheese Burger',
        description: 'Fresh made-to-order two-patty cheeseburger, served in your choice of wrap or sub.',
        basePrice: 12.99
      },
      {
        name: 'Chicken Fingers/Tenders',
        description: 'Fresh made-to-order chicken fingers, served in your choice of wrap or sub.',
        basePrice: 12.99
      },
      {
        name: 'Chicken Caesar Wrap',
        description: 'Fresh made-to-order grilled chicken and Caesar fixings, in your choice of wrap.',
        basePrice: 14.50
      },
      {
        name: 'Meat Ball Sub',
        description: 'Meatballs in marinara sauce, with no cheese or any of our cheese options.',
        basePrice: 11.99
      },
      {
        name: 'Hot Pastrami',
        description: 'Hot pastrami piled in a wrap or 10″ sub, with customizable toppings.',
        basePrice: 12.99
      },
      {
        name: 'Hot Veggies',
        description: 'Fresh made-to-order grilled mushrooms, peppers, and onions in wrap or sub.',
        basePrice: 12.99
      },
      {
        name: 'Eggplant',
        description: 'Fresh made-to-order grilled eggplant, served in your choice of wrap or sub.',
        basePrice: 12.25
      },
      {
        name: 'Veal Cutlet',
        description: 'Fresh made-to-order veal cutlet, served in your choice of wrap or sub.',
        basePrice: 12.99
      },
      {
        name: 'Sausage Sub',
        description: 'Fresh made-to-order Italian sausage, served in your choice of wrap or sub.',
        basePrice: 12.99
      }
    ];
    
    // Create all hot sub items
    console.log('Creating hot sub items...');
    for (let i = 0; i < hotSubItems.length; i++) {
      const item = hotSubItems[i];
      
      const createdItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          categoryId: hotSubsCategory.id,
          isActive: true,
          sortOrder: i + 1,
          customizationGroups: {
            create: {
              customizationGroupId: hotSubsGroup.id,
              sortOrder: 1
            }
          }
        }
      });
      
      console.log(`Created: ${createdItem.name} - $${createdItem.basePrice}`);
    }
    
    console.log('\\nHot Subs category created successfully!');
    console.log(`Category: ${hotSubsCategory.name}`);
    console.log(`Items created: ${hotSubItems.length}`);
    console.log(`Customization group: ${hotSubsGroup.name}`);
    
  } catch (error) {
    console.error('Error creating hot subs category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createHotSubsCategory();
