const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createChickenWingsCategory() {
  try {
    console.log('Creating Chicken & Wings category and menu items...');

    // Check if Chicken & Wings category already exists
    let chickenWingsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Chicken & Wings' }
    });

    if (!chickenWingsCategory) {
      console.log('Creating Chicken & Wings category...');
      chickenWingsCategory = await prisma.menuCategory.create({
        data: {
          name: 'Chicken & Wings',
          slug: 'chicken-wings',
          description: 'Protein-heavy mains or appetizers',
          isActive: true,
          sortOrder: 14
        }
      });
      console.log(`✓ Created Chicken & Wings category: ${chickenWingsCategory.id}`);
    } else {
      console.log(`✓ Found existing Chicken & Wings category: ${chickenWingsCategory.id}`);
    }

    // Define the chicken & wings menu items
    const chickenWingsItems = [
      {
        name: 'BBQ Chicken Fingers',
        description: 'Crispy chicken fingers tossed in BBQ sauce',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        name: 'Buffalo Chicken Fingers',
        description: 'Crispy chicken fingers tossed in spicy buffalo sauce',
        basePrice: 11.99,
        sortOrder: 2
      },
      {
        name: 'Chicken Fingers',
        description: 'Classic crispy chicken fingers with choice of dipping sauce',
        basePrice: 11.99,
        sortOrder: 3
      },
      {
        name: 'Buffalo Chicken Wings',
        description: 'Juicy chicken wings tossed in spicy buffalo sauce',
        basePrice: 11.99,
        sortOrder: 4
      },
      {
        name: 'BBQ Chicken Wings',
        description: 'Juicy chicken wings tossed in BBQ sauce',
        basePrice: 11.99,
        sortOrder: 5
      },
      {
        name: 'Chicken Wings',
        description: 'Classic chicken wings with choice of sauce',
        basePrice: 11.99,
        sortOrder: 6
      }
    ];

    console.log(`Creating ${chickenWingsItems.length} chicken & wings menu items...`);

    for (const item of chickenWingsItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: chickenWingsCategory.id
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
          categoryId: chickenWingsCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} – $${item.basePrice.toFixed(2)}`);
    }

    console.log('\n🎉 Chicken & Wings category and menu items created successfully!');
    console.log('\n🍗 Chicken & Wings - Protein-heavy mains or appetizers:');
    console.log('');
    chickenWingsItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} – $${item.basePrice.toFixed(2)}`);
      if (item.description) {
        console.log(`   ${item.description}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error creating Chicken & Wings category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChickenWingsCategory();
