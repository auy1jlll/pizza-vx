const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAppetizerItems() {
  try {
    console.log('🍤 Adding appetizer menu items...\n');

    // Get existing appetizer categories
    const friedAppetizerCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'fried-appetizers' }
    });
    
    const soupCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'soups-chowders' }
    });
    
    const specialtyCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'specialty-items' }
    });

    if (!friedAppetizerCategory || !soupCategory || !specialtyCategory) {
      console.log('❌ Appetizer categories not found');
      return;
    }

    console.log('✅ Found all appetizer categories');

    // Add fried appetizer items
    const friedAppetizers = [
      {
        name: 'Mozzarella Sticks (6 pcs)',
        description: 'Golden fried mozzarella with marinara sauce',
        basePrice: 6.99,
        categoryId: friedAppetizerCategory.id,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        basePrice: 5.99,
        categoryId: friedAppetizerCategory.id,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Jalapeño Poppers (6 pcs)',
        description: 'Cream cheese stuffed jalapeños, breaded and fried',
        basePrice: 7.49,
        categoryId: friedAppetizerCategory.id,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Fried Pickles',
        description: 'Beer-battered dill pickle spears',
        basePrice: 6.49,
        categoryId: friedAppetizerCategory.id,
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Loaded Potato Skins (4 pcs)',
        description: 'Crispy potato skins with cheese, bacon, and sour cream',
        basePrice: 8.99,
        categoryId: friedAppetizerCategory.id,
        isActive: true,
        sortOrder: 5
      }
    ];

    // Add soup items
    const soups = [
      {
        name: 'New England Clam Chowder',
        description: 'Creamy clam chowder with tender clams and potatoes',
        basePrice: 4.99,
        categoryId: soupCategory.id,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Seafood Bisque',
        description: 'Rich and creamy seafood bisque',
        basePrice: 5.99,
        categoryId: soupCategory.id,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Fish Chowder',
        description: 'Traditional New England fish chowder',
        basePrice: 4.99,
        categoryId: soupCategory.id,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Lobster Bisque',
        description: 'Premium lobster bisque with real lobster meat',
        basePrice: 7.99,
        categoryId: soupCategory.id,
        isActive: true,
        sortOrder: 4
      }
    ];

    // Add specialty items
    const specialtyItems = [
      {
        name: 'Stuffed Clams (2 pcs)',
        description: 'Fresh clams stuffed with seasoned breadcrumb mixture',
        basePrice: 8.99,
        categoryId: specialtyCategory.id,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Clam Cakes (6 pcs)',
        description: 'Traditional Rhode Island clam cakes',
        basePrice: 6.99,
        categoryId: specialtyCategory.id,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Calamari Rings',
        description: 'Fresh squid rings lightly breaded and fried',
        basePrice: 9.99,
        categoryId: specialtyCategory.id,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Shrimp Cocktail (6 pcs)',
        description: 'Chilled jumbo shrimp with cocktail sauce',
        basePrice: 11.99,
        categoryId: specialtyCategory.id,
        isActive: true,
        sortOrder: 4
      }
    ];

    console.log('\n🍤 Creating Fried Appetizer items...');
    for (const item of friedAppetizers) {
      const created = await prisma.menuItem.create({
        data: item
      });
      console.log(`✅ Created: ${created.name} - $${created.basePrice}`);
    }

    console.log('\n🍲 Creating Soup items...');
    for (const item of soups) {
      const created = await prisma.menuItem.create({
        data: item
      });
      console.log(`✅ Created: ${created.name} - $${created.basePrice}`);
    }

    console.log('\n⭐ Creating Specialty items...');
    for (const item of specialtyItems) {
      const created = await prisma.menuItem.create({
        data: item
      });
      console.log(`✅ Created: ${created.name} - $${created.basePrice}`);
    }

    console.log('\n✅ Successfully added all appetizer items!');
    console.log('\nAppetizer categories now have:');
    console.log('🍤 Fried Appetizers: 5 items');
    console.log('🍲 Soups & Chowders: 4 items');
    console.log('⭐ Specialty Items: 4 items');

  } catch (error) {
    console.error('❌ Error adding appetizer items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAppetizerItems();
