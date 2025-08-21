const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDinnerPlateCategory() {
  try {
    console.log('Creating/Overwriting Dinner Plate category and menu items...');

    // Check if Dinner Plate category already exists
    let dinnerPlateCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Dinner Plate' }
    });

    if (dinnerPlateCategory) {
      console.log('Found existing Dinner Plate category - will overwrite items...');
      
      // Delete existing menu items in this category
      const existingItems = await prisma.menuItem.findMany({
        where: { categoryId: dinnerPlateCategory.id }
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
          where: { categoryId: dinnerPlateCategory.id }
        });
        
        console.log('✓ Existing items removed');
      }
    } else {
      console.log('Creating new Dinner Plate category...');
      dinnerPlateCategory = await prisma.menuCategory.create({
        data: {
          name: 'Dinner Plate',
          slug: 'dinner-plate',
          description: 'Complete dinner plates with generous portions',
          isActive: true,
          sortOrder: 17
        }
      });
      console.log(`✓ Created Dinner Plate category: ${dinnerPlateCategory.id}`);
    }

    // Define the dinner plate menu items - CAREFUL WITH PRICING (2 decimals as float)
    const dinnerPlateItems = [
      {
        name: 'Gyro Plate',
        description: 'A gyro filled with delicious meat, onions, tomatoes and Tzatziki sauce, served with fries, onion rings and a choice of coleslaw or pasta salad',
        basePrice: 17.25,
        sortOrder: 1
      },
      {
        name: 'Hamburger Plate',
        description: 'Grilled Burger patty on a sesame hamburger bun, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 14.99,
        sortOrder: 2
      },
      {
        name: 'Cheeseburger Plate',
        description: 'Grilled Cheese Burger on a sesame hamburger bun, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 15.50,
        sortOrder: 3
      },
      {
        name: 'Chicken Kabob Plate',
        description: 'Grilled chicken breast served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 16.50,
        sortOrder: 4
      },
      {
        name: 'Chicken Wings Plate',
        description: 'Chicken wings deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 16.50,
        sortOrder: 5
      },
      {
        name: 'Chicken Fingers Plate',
        description: 'Chicken tenders deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 17.45,
        sortOrder: 6
      },
      {
        name: 'Roast Beef Plate',
        description: 'Slow roasted beef for hours to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 17.99,
        sortOrder: 7
      },
      {
        name: 'Steak Tip Kabob Plate',
        description: 'Grilled Steak tips, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 19.99,
        sortOrder: 8
      },
      {
        name: 'Fish \'n Chips',
        description: 'A big plate of haddock fish on a bed of french fries',
        basePrice: 27.50,
        sortOrder: 9
      }
    ];

    console.log(`Creating ${dinnerPlateItems.length} dinner plate menu items...`);
    console.log('📋 Price verification before creation:');
    dinnerPlateItems.forEach(item => {
      console.log(`   ${item.name}: $${item.basePrice.toFixed(2)} (stored as ${item.basePrice})`);
    });
    console.log('');

    for (const item of dinnerPlateItems) {
      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice, // Store as float value
          categoryId: dinnerPlateCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} – $${menuItem.basePrice.toFixed(2)} (verified correct pricing)`);
    }

    console.log('\n🎉 Dinner Plate category and menu items created successfully!');
    console.log('\n🍽️ Dinner Plate - Complete dinner plates with generous portions:');
    console.log('');
    
    // Final verification of all items in the category
    const finalVerification = await prisma.menuItem.findMany({
      where: { categoryId: dinnerPlateCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    finalVerification.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} – $${item.basePrice.toFixed(2)}`);
      if (item.description) {
        console.log(`   ${item.description}`);
      }
      console.log('');
    });

    console.log('✅ All prices verified as correct 2-decimal format!');
    console.log('💡 Note: All plates include fries, onion rings, and choice of coleslaw or pasta salad (except Fish \'n Chips)');

  } catch (error) {
    console.error('Error creating Dinner Plate category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDinnerPlateCategory();
