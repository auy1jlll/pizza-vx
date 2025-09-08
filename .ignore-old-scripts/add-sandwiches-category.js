const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSandwichesCategory() {
  try {
    console.log('🥪 Adding Sandwiches category and menu items...\n');

    // Check if Sandwiches category already exists
    let sandwichesCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { name: 'Sandwiches' },
          { slug: 'sandwiches' }
        ]
      }
    });

    if (!sandwichesCategory) {
      // Create the Sandwiches category
      sandwichesCategory = await prisma.menuCategory.create({
        data: {
          name: 'Sandwiches',
          slug: 'sandwiches',
          description: 'Classic sandwiches and burgers',
          isActive: true,
          sortOrder: 6 // Place it after subs categories
        }
      });
      console.log(`✅ Created Sandwiches category: ${sandwichesCategory.name}`);
    } else {
      console.log(`✅ Found existing Sandwiches category: ${sandwichesCategory.name}`);
    }

    // Define the sandwich items to add
    const sandwichItems = [
      {
        name: 'Super Beef on Onion Roll',
        description: 'Premium beef sandwich served on fresh onion roll',
        basePrice: 12.55,
        sortOrder: 1
      },
      {
        name: 'Regular Beef on Sesame Roll', 
        description: 'Classic beef sandwich served on sesame roll',
        basePrice: 11.55,
        sortOrder: 2
      },
      {
        name: 'Junior Beef',
        description: 'Smaller portion beef sandwich perfect for lighter appetites',
        basePrice: 10.55,
        sortOrder: 3
      },
      {
        name: 'Super Pastrami on Onion Roll',
        description: 'Premium pastrami sandwich served on fresh onion roll',
        basePrice: 12.55,
        sortOrder: 4
      },
      {
        name: 'Regular Pastrami',
        description: 'Classic pastrami sandwich on your choice of bread',
        basePrice: 11.55,
        sortOrder: 5
      },
      {
        name: 'Haddock Sandwich (2pcs)',
        description: 'Two pieces of fresh haddock served on sesame bun',
        basePrice: 16.30,
        sortOrder: 6
      },
      {
        name: 'Chicken Sandwich',
        description: 'Crispy chicken breast served with lettuce and tomato',
        basePrice: 8.55,
        sortOrder: 7
      },
      {
        name: 'Hamburger',
        description: 'Classic hamburger with fresh beef patty',
        basePrice: 7.80,
        sortOrder: 8
      },
      {
        name: 'Cheeseburger',
        description: 'Classic hamburger with melted cheese',
        basePrice: 8.30,
        sortOrder: 9
      },
      {
        name: 'Hot Dog',
        description: 'All-beef hot dog served on frankfurter roll',
        basePrice: 6.30,
        sortOrder: 10
      },
      {
        name: 'Gyro',
        description: 'Traditional Greek gyro with lamb and beef, onions, tomatoes and tzatziki sauce',
        basePrice: 11.50,
        sortOrder: 11
      },
      {
        name: 'Reuben',
        description: 'Classic Reuben with corned beef, sauerkraut, Swiss cheese and thousand island dressing on rye',
        basePrice: 12.80,
        sortOrder: 12
      }
    ];

    console.log('📝 Adding sandwich menu items...\n');

    // Add each sandwich item
    const createdItems = [];
    for (const item of sandwichItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          categoryId: sandwichesCategory.id,
          name: item.name
        }
      });

      if (!existingItem) {
        const createdItem = await prisma.menuItem.create({
          data: {
            categoryId: sandwichesCategory.id,
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            isActive: true,
            isAvailable: true,
            sortOrder: item.sortOrder
          }
        });
        createdItems.push(createdItem);
        console.log(`✅ Added: ${item.name} - $${item.basePrice}`);
      } else {
        console.log(`⚠️ Already exists: ${item.name} - $${existingItem.basePrice}`);
      }
    }

    console.log(`\n🎉 Successfully processed ${sandwichItems.length} sandwich items!`);
    console.log(`✅ Created ${createdItems.length} new items`);

    // Show summary of all items in Sandwiches category
    console.log('\n📋 All items in Sandwiches category:');
    const allSandwiches = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    allSandwiches.forEach(item => {
      console.log(`  • ${item.name} - $${item.basePrice}`);
    });

  } catch (error) {
    console.error('❌ Error adding sandwiches:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSandwichesCategory();
