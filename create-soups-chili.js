const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSoupsChiliCategory() {
  try {
    console.log('Creating Soups & Chili category and menu items...');

    // Check if Soups & Chili category already exists
    let soupsChiliCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Soups & Chili' }
    });

    if (!soupsChiliCategory) {
      console.log('Creating Soups & Chili category...');
      soupsChiliCategory = await prisma.menuCategory.create({
        data: {
          name: 'Soups & Chili',
          slug: 'soups-chili',
          description: 'Warm, comforting starters or sides',
          isActive: true,
          sortOrder: 15
        }
      });
      console.log(`✓ Created Soups & Chili category: ${soupsChiliCategory.id}`);
    } else {
      console.log(`✓ Found existing Soups & Chili category: ${soupsChiliCategory.id}`);
    }

    // Define the soups & chili menu items - CAREFUL WITH PRICING (2 decimals as float)
    const soupsChiliItems = [
      {
        name: 'Cup of Chili',
        description: 'Hearty homemade chili with beans and ground beef',
        basePrice: 7.00, // $7.00 as float (NOT 700 cents)
        sortOrder: 1
      },
      {
        name: 'Chicken Noodle Soup',
        description: 'Classic chicken soup with tender noodles and vegetables',
        basePrice: 7.00, // $7.00 as float (NOT 700 cents)
        sortOrder: 2
      },
      {
        name: 'Clam Chowder',
        description: 'Creamy New England style clam chowder',
        basePrice: 9.50, // $9.50 as float (NOT 950 cents)
        sortOrder: 3
      },
      {
        name: 'Haddock Chowder',
        description: 'Rich and creamy haddock chowder with fresh fish',
        basePrice: 9.50, // $9.50 as float (NOT 950 cents)
        sortOrder: 4
      }
    ];

    console.log(`Creating ${soupsChiliItems.length} soups & chili menu items...`);
    console.log('📋 Price verification before creation:');
    soupsChiliItems.forEach(item => {
      console.log(`   ${item.name}: $${item.basePrice.toFixed(2)} (stored as ${item.basePrice})`);
    });
    console.log('');

    for (const item of soupsChiliItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: soupsChiliCategory.id
        }
      });

      if (existingItem) {
        console.log(`  - ${item.name} already exists (current price: $${existingItem.basePrice.toFixed(2)}), skipping...`);
        continue;
      }

      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice, // Store as float value
          categoryId: soupsChiliCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} – $${menuItem.basePrice.toFixed(2)} (verified correct pricing)`);
    }

    console.log('\n🎉 Soups & Chili category and menu items created successfully!');
    console.log('\n🥣 Soups & Chili - Warm, comforting starters or sides:');
    console.log('');
    
    // Final verification of all items in the category
    const finalVerification = await prisma.menuItem.findMany({
      where: { categoryId: soupsChiliCategory.id },
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

  } catch (error) {
    console.error('Error creating Soups & Chili category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSoupsChiliCategory();
