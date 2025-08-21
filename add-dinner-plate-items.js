const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDinnerPlateItems() {
  try {
    console.log('🍽️ Adding Dinner Plate Items...\n');

    // First, find the dinner plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { slug: 'dinner-plates' },
          { slug: 'dinner_plates' },
          { name: { contains: 'Dinner Plates', mode: 'insensitive' } },
          { name: { contains: 'Dinner', mode: 'insensitive' } }
        ]
      },
      include: {
        menuItems: true
      }
    });

    if (!dinnerPlatesCategory) {
      console.log('❌ Dinner Plates category not found!');
      return;
    }

    console.log(`📁 Found category: ${dinnerPlatesCategory.name} (${dinnerPlatesCategory.slug})`);
    console.log(`📊 Current items in category: ${dinnerPlatesCategory.menuItems.length}`);

    // Define the new dinner plate items
    const newDinnerPlateItems = [
      {
        name: 'Gyro Plate',
        description: 'Traditional gyro meat served with rice, salad, and pita bread',
        basePrice: 1599, // $15.99
        preparationTime: 15,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Hamburger Plate',
        description: 'Juicy hamburger patty served with fries and coleslaw',
        basePrice: 1399, // $13.99
        preparationTime: 12,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Cheeseburger Plate',
        description: 'Hamburger patty with cheese, served with fries and coleslaw',
        basePrice: 1499, // $14.99
        preparationTime: 12,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Chicken Kabob Plate',
        description: 'Grilled chicken kabob served with rice, salad, and pita bread',
        basePrice: 1699, // $16.99
        preparationTime: 18,
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Chicken Wings Plate',
        description: 'Buffalo chicken wings served with fries and blue cheese',
        basePrice: 1549, // $15.49
        preparationTime: 15,
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'Chicken Fingers Plate',
        description: 'Crispy chicken tenders served with fries and honey mustard',
        basePrice: 1449, // $14.49
        preparationTime: 12,
        isActive: true,
        sortOrder: 6
      },
      {
        name: 'Roast Beef Plate',
        description: 'Sliced roast beef served with mashed potatoes and vegetables',
        basePrice: 1799, // $17.99
        preparationTime: 10,
        isActive: true,
        sortOrder: 7
      },
      {
        name: 'Steak Tip Kabob Plate',
        description: 'Marinated steak tips on skewers with rice, salad, and pita bread',
        basePrice: 1899, // $18.99
        preparationTime: 20,
        isActive: true,
        sortOrder: 8
      }
    ];

    console.log('\n🔄 Creating new dinner plate items...');

    for (const item of newDinnerPlateItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: dinnerPlatesCategory.id
        }
      });

      if (existingItem) {
        console.log(`⚠️  ${item.name} already exists, skipping...`);
        continue;
      }

      const createdItem = await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: dinnerPlatesCategory.id
        }
      });

      console.log(`✅ Created: ${createdItem.name} - $${(createdItem.basePrice / 100).toFixed(2)}`);
    }

    // Get updated category with all items
    const updatedCategory = await prisma.menuCategory.findUnique({
      where: { id: dinnerPlatesCategory.id },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n📋 Final Dinner Plates Menu:');
    console.log(`📁 Category: ${updatedCategory.name}`);
    console.log(`📊 Total items: ${updatedCategory.menuItems.length}`);
    console.log('\nItems:');
    updatedCategory.menuItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - $${(item.basePrice / 100).toFixed(2)}`);
      console.log(`     ${item.description}`);
      console.log(`     ⏱️  ${item.preparationTime} min | ${item.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log('');
    });

    console.log('🎉 Dinner plate items added successfully!');

  } catch (error) {
    console.error('❌ Error adding dinner plate items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDinnerPlateItems();
