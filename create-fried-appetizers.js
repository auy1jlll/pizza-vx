const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createFriedAppetizersCategory() {
  try {
    console.log('Creating Fried Appetizers category and menu items...');

    // Check if Fried Appetizers category already exists
    let friedAppetizersCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Fried Appetizers' }
    });

    if (!friedAppetizersCategory) {
      console.log('Creating Fried Appetizers category...');
      friedAppetizersCategory = await prisma.menuCategory.create({
        data: {
          name: 'Fried Appetizers',
          slug: 'fried-appetizers',
          description: 'Crispy, shareable starters',
          isActive: true,
          sortOrder: 13
        }
      });
      console.log(`✓ Created Fried Appetizers category: ${friedAppetizersCategory.id}`);
    } else {
      console.log(`✓ Found existing Fried Appetizers category: ${friedAppetizersCategory.id}`);
    }

    // Define the fried appetizer menu items
    const friedAppetizerItems = [
      {
        name: 'Fried Raviolis',
        description: 'Crispy breaded raviolis served with marinara sauce',
        basePrice: 9.00,
        sortOrder: 1
      },
      {
        name: 'Fried Mushrooms',
        description: 'Golden fried mushrooms with ranch dipping sauce',
        basePrice: 9.00,
        sortOrder: 2
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Crispy breaded mozzarella sticks with marinara sauce',
        basePrice: 9.00,
        sortOrder: 3
      },
      {
        name: 'Spinach Egg Roll',
        description: 'Crispy egg roll filled with spinach and cheese',
        basePrice: 4.50,
        sortOrder: 4
      },
      {
        name: 'Pizza Egg Roll',
        description: 'Crispy egg roll filled with pizza ingredients',
        basePrice: 4.50,
        sortOrder: 5
      }
    ];

    console.log(`Creating ${friedAppetizerItems.length} fried appetizer menu items...`);

    for (const item of friedAppetizerItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: friedAppetizersCategory.id
        }
      });

      if (existingItem) {
        console.log(`  - ${item.name} already exists, skipping...`);
        continue;
      }

      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          categoryId: friedAppetizersCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} - $${item.basePrice.toFixed(2)}`);
    }

    console.log('\n🎉 Fried Appetizers category and menu items created successfully!');
    console.log('\n📋 Fried Appetizers - Crispy, shareable starters:');
    console.log('');
    friedAppetizerItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} – $${item.basePrice.toFixed(2)}`);
      if (item.description) {
        console.log(`   ${item.description}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error creating Fried Appetizers category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFriedAppetizersCategory();
