const { createRequire } = require('module');
const require = createRequire(import.meta.url || __filename);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSideOrdersCategory() {
  try {
    console.log('Creating Side Orders category...');
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        name: 'Side Orders',
        slug: 'side-orders',
        description: 'Delicious appetizers and side dishes to complement your meal',
        imageUrl: null,
        isActive: true,
        sortOrder: 6
      }
    });

    console.log('Created category:', category.name);

    // Define the side order items
    const sideOrderItems = [
      {
        name: 'BBQ Chicken Fingers',
        description: 'Crispy chicken tenders with BBQ sauce',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        name: 'Cup of Chili',
        description: 'Hearty homemade chili',
        basePrice: 7.00,
        sortOrder: 2
      },
      {
        name: 'Chicken Noodle Soup',
        description: 'Classic comfort soup with tender chicken and noodles',
        basePrice: 7.00,
        sortOrder: 3
      },
      {
        name: 'Clam Chowder',
        description: 'Creamy New England style clam chowder',
        basePrice: 9.50,
        sortOrder: 4
      },
      {
        name: 'Haddock Chowder',
        description: 'Rich and creamy haddock chowder',
        basePrice: 9.50,
        sortOrder: 5
      },
      {
        name: 'Fried Raviolis',
        description: 'Golden fried ravioli with marinara sauce',
        basePrice: 9.00,
        sortOrder: 6
      },
      {
        name: 'Fried Mushrooms',
        description: 'Beer battered mushrooms, crispy and delicious',
        basePrice: 9.00,
        sortOrder: 7
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Breaded mozzarella with marinara sauce',
        basePrice: 9.00,
        sortOrder: 8
      },
      {
        name: 'Spinach Egg Roll',
        description: 'Crispy egg roll filled with seasoned spinach',
        basePrice: 4.50,
        sortOrder: 9
      },
      {
        name: 'Pizza Egg Roll',
        description: 'Egg roll filled with pizza ingredients',
        basePrice: 4.50,
        sortOrder: 10
      },
      {
        name: 'French Fries',
        description: 'Classic crispy french fries',
        basePrice: 6.00,
        sortOrder: 11
      },
      {
        name: 'Buffalo Chicken Fingers',
        description: 'Spicy buffalo chicken tenders',
        basePrice: 11.99,
        sortOrder: 12
      },
      {
        name: 'Buffalo Chicken Wings',
        description: 'Classic buffalo wings with hot sauce',
        basePrice: 11.99,
        sortOrder: 13
      },
      {
        name: 'BBQ Chicken Wings',
        description: 'Wings tossed in BBQ sauce',
        basePrice: 11.99,
        sortOrder: 14
      },
      {
        name: 'Chicken Wings',
        description: 'Plain chicken wings',
        basePrice: 11.99,
        sortOrder: 15
      },
      {
        name: 'Chicken Fingers',
        description: 'Crispy chicken tenders',
        basePrice: 11.99,
        sortOrder: 16
      },
      {
        name: 'Pasta Salad',
        description: 'Fresh pasta salad with vegetables',
        basePrice: 5.00,
        sortOrder: 17
      },
      {
        name: 'Cole Slaw',
        description: 'Fresh and creamy coleslaw',
        basePrice: 5.00,
        sortOrder: 18
      },
      {
        name: 'Onion Rings',
        description: 'Beer battered onion rings',
        basePrice: 6.00,
        sortOrder: 19
      }
    ];

    // Create the menu items
    console.log('Creating menu items...');
    for (const item of sideOrderItems) {
      const menuItem = await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: category.id,
          imageUrl: null,
          isActive: true,
          preparationTime: 10
        }
      });
      console.log(`Created: ${menuItem.name} - $${menuItem.basePrice}`);
    }

    // Create size customization group for items that have SM/LG options
    console.log('Creating size customization group...');
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Size',
        description: 'Choose your size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    // Create size options
    const sizeOptions = [
      { name: 'Small', priceModifier: 0, sortOrder: 1 },
      { name: 'Large', priceModifier: 1.00, sortOrder: 2 }
    ];

    for (const sizeOption of sizeOptions) {
      await prisma.customizationOption.create({
        data: {
          ...sizeOption,
          description: null,
          priceType: 'FLAT',
          isDefault: sizeOption.name === 'Small',
          isActive: true,
          customizationGroupId: sizeGroup.id
        }
      });
    }

    // Create sauce customization group
    console.log('Creating sauce customization group...');
    const sauceGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Dipping Sauces',
        description: 'First dip is free, additional dips $0.50 each',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2,
        isActive: true
      }
    });

    // Create sauce options
    const sauceOptions = [
      { name: 'BBQ Sauce', priceModifier: 0, free: true },
      { name: 'Blue Cheese', priceModifier: 0, free: true },
      { name: 'Buffalo Sauce', priceModifier: 0, free: true },
      { name: 'Marinara Sauce', priceModifier: 0, free: true },
      { name: 'Ranch Dressing', priceModifier: 0, free: true },
      { name: 'Duck Sauce', priceModifier: 0, free: true },
      { name: 'Oil & Vinegar', priceModifier: 0, free: true },
      { name: 'Extra BBQ Sauce', priceModifier: 0.50, free: false },
      { name: 'Extra Blue Cheese', priceModifier: 0.50, free: false },
      { name: 'Extra Buffalo Sauce', priceModifier: 0.50, free: false },
      { name: 'Extra Marinara Sauce', priceModifier: 0.50, free: false },
      { name: 'Extra Ranch Dressing', priceModifier: 0.50, free: false }
    ];

    for (let i = 0; i < sauceOptions.length; i++) {
      const sauce = sauceOptions[i];
      await prisma.customizationOption.create({
        data: {
          name: sauce.name,
          description: sauce.free ? 'Free with order' : 'Additional charge',
          priceModifier: sauce.priceModifier,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: i + 1,
          customizationGroupId: sauceGroup.id,
          maxQuantity: 3
        }
      });
    }

    // Link customization groups to relevant items
    const itemsNeedingSizes = [
      'French Fries', 'Pasta Salad', 'Cole Slaw', 'Onion Rings'
    ];

    const itemsNeedingSauces = [
      'BBQ Chicken Fingers', 'Buffalo Chicken Fingers', 'Buffalo Chicken Wings', 
      'BBQ Chicken Wings', 'Chicken Wings', 'Chicken Fingers', 'Fried Raviolis',
      'Fried Mushrooms', 'Mozzarella Sticks'
    ];

    console.log('Linking customization groups to menu items...');

    // Link size group to items that need sizes
    for (const itemName of itemsNeedingSizes) {
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: itemName, categoryId: category.id }
      });
      
      if (menuItem) {
        await prisma.itemCustomizationGroup.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`Linked size group to ${itemName}`);
      }
    }

    // Link sauce group to items that need sauces
    for (const itemName of itemsNeedingSauces) {
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: itemName, categoryId: category.id }
      });
      
      if (menuItem) {
        await prisma.itemCustomizationGroup.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: sauceGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        });
        console.log(`Linked sauce group to ${itemName}`);
      }
    }

    console.log('✅ Side Orders category created successfully!');
    console.log(`Created ${sideOrderItems.length} menu items`);
    console.log('Added size and sauce customization options');

  } catch (error) {
    console.error('Error creating side orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSideOrdersCategory();
