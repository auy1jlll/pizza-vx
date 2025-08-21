const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSandwichItems() {
  try {
    console.log('🥪 Adding Sandwich Items...\n');

    // First, find the sandwiches category
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { slug: 'sandwiches' },
          { slug: 'sandwiches-burgers' },
          { name: { contains: 'Sandwich', mode: 'insensitive' } }
        ]
      },
      include: {
        menuItems: true
      }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found!');
      return;
    }

    console.log(`📁 Found category: ${sandwichesCategory.name} (${sandwichesCategory.slug})`);
    console.log(`📊 Current items in category: ${sandwichesCategory.menuItems.length}`);

    // Define the new sandwich items
    const newSandwichItems = [
      {
        name: 'Roast Beef Sandwich',
        description: 'Tender roast beef with lettuce, tomato, and choice of cheese on your preferred bread',
        basePrice: 899, // $8.99
        preparationTime: 8,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Haddock Sandwich (2 pcs)',
        description: 'Two pieces of beer-battered haddock with lettuce, tomato, and tartar sauce',
        basePrice: 1099, // $10.99
        preparationTime: 12,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Reuben on Rye',
        description: 'Classic corned beef, Swiss cheese, sauerkraut, and Russian dressing on rye bread',
        basePrice: 1149, // $11.49
        preparationTime: 10,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Gyro',
        description: 'Traditional gyro meat with tzatziki sauce, onions, and tomatoes in pita bread',
        basePrice: 949, // $9.49
        preparationTime: 8,
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Hot Dog',
        description: 'All-beef hot dog with your choice of toppings on a fresh bun',
        basePrice: 549, // $5.49
        preparationTime: 5,
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'Hot Pastrami',
        description: 'Hot sliced pastrami with mustard, pickles, and onions on rye bread',
        basePrice: 1049, // $10.49
        preparationTime: 10,
        isActive: true,
        sortOrder: 6
      },
      {
        name: 'Chicken Sandwich',
        description: 'Grilled or crispy chicken breast with lettuce, tomato, and mayo on a brioche bun',
        basePrice: 899, // $8.99
        preparationTime: 12,
        isActive: true,
        sortOrder: 7
      },
      {
        name: 'Hamburger',
        description: 'Classic beef patty with lettuce, tomato, onion, and pickles on a sesame bun',
        basePrice: 799, // $7.99
        preparationTime: 10,
        isActive: true,
        sortOrder: 8
      }
    ];

    console.log('\n🔄 Creating new sandwich items...');

    for (const item of newSandwichItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: sandwichesCategory.id
        }
      });

      if (existingItem) {
        console.log(`⚠️  ${item.name} already exists, skipping...`);
        continue;
      }

      const createdItem = await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: sandwichesCategory.id
        }
      });

      console.log(`✅ Created: ${createdItem.name} - $${(createdItem.basePrice / 100).toFixed(2)}`);
    }

    // Get updated category with all items
    const updatedCategory = await prisma.menuCategory.findUnique({
      where: { id: sandwichesCategory.id },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n📋 Final Sandwiches Menu:');
    console.log(`📁 Category: ${updatedCategory.name}`);
    console.log(`📊 Total items: ${updatedCategory.menuItems.length}`);
    console.log('\nItems:');
    updatedCategory.menuItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - $${(item.basePrice / 100).toFixed(2)}`);
      console.log(`     ${item.description}`);
      console.log(`     ⏱️  ${item.preparationTime} min | ${item.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log('');
    });

    console.log('🎉 Sandwich items added successfully!');

  } catch (error) {
    console.error('❌ Error adding sandwich items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSandwichItems();
