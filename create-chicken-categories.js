const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createChickenCategories() {
  try {
    console.log('🍗 Adding Chicken menu items to existing categories...\n');

    // Get existing categories
    const wingsCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'chicken-wings' }
    });
    
    const fingersCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'chicken-fingers' }
    });

    if (!wingsCategory || !fingersCategory) {
      console.log('❌ Chicken categories not found. Creating them first...');
      
      if (!wingsCategory) {
        const newWingsCategory = await prisma.menuCategory.create({
          data: {
            name: 'Chicken Wings',
            slug: 'chicken-wings',
            description: 'Delicious chicken wings in various flavors',
            isActive: true,
            sortOrder: 40,
          }
        });
        console.log('✅ Created Wings category:', newWingsCategory.name);
      }

      if (!fingersCategory) {
        const newFingersCategory = await prisma.menuCategory.create({
          data: {
            name: 'Chicken Fingers',
            slug: 'chicken-fingers',
            description: 'Crispy chicken tenders and fingers',
            isActive: true,
            sortOrder: 41,
          }
        });
        console.log('✅ Created Fingers category:', newFingersCategory.name);
      }
      
      return; // Exit and let user run again
    }

    console.log(`✅ Found Wings category: ${wingsCategory.name}`);
    console.log(`✅ Found Fingers category: ${fingersCategory.name}`);

    // Check for existing chicken items
    const existingWingItems = await prisma.menuItem.findMany({
      where: { categoryId: wingsCategory.id }
    });

    const existingFingerItems = await prisma.menuItem.findMany({
      where: { categoryId: fingersCategory.id }
    });

    // Create sample wing items if none exist
    if (existingWingItems.length === 0) {
      const wingItems = [
        {
          name: 'Buffalo Wings (6 pcs)',
          description: 'Classic buffalo wings with hot sauce',
          basePrice: 8.99,
          categoryId: wingsCategory.id
        },
        {
          name: 'Buffalo Wings (12 pcs)',
          description: 'Classic buffalo wings with hot sauce',
          basePrice: 15.99,
          categoryId: wingsCategory.id
        },
        {
          name: 'BBQ Wings (6 pcs)',
          description: 'Sweet and tangy BBQ wings',
          basePrice: 8.99,
          categoryId: wingsCategory.id
        },
        {
          name: 'BBQ Wings (12 pcs)',
          description: 'Sweet and tangy BBQ wings',
          basePrice: 15.99,
          categoryId: wingsCategory.id
        },
        {
          name: 'Honey Garlic Wings (6 pcs)',
          description: 'Sweet honey garlic glazed wings',
          basePrice: 9.49,
          categoryId: wingsCategory.id
        },
        {
          name: 'Honey Garlic Wings (12 pcs)',
          description: 'Sweet honey garlic glazed wings',
          basePrice: 17.49,
          categoryId: wingsCategory.id
        }
      ];

      console.log('\n🍗 Creating Wing menu items...');
      for (const item of wingItems) {
        const created = await prisma.menuItem.create({
          data: item
        });
        console.log(`✅ Created: ${created.name} - $${created.basePrice}`);
      }
    } else {
      console.log(`ℹ️ Wings category already has ${existingWingItems.length} items`);
    }

    // Create finger items if none exist
    if (existingFingerItems.length === 0) {
      const fingerItems = [
        {
          name: 'Chicken Tenders (3 pcs)',
          description: 'Crispy breaded chicken tenders',
          basePrice: 7.99,
          categoryId: fingersCategory.id
        },
        {
          name: 'Chicken Tenders (5 pcs)',
          description: 'Crispy breaded chicken tenders',
          basePrice: 12.99,
          categoryId: fingersCategory.id
        },
        {
          name: 'Buffalo Chicken Tenders (5 pcs)',
          description: 'Crispy tenders tossed in buffalo sauce',
          basePrice: 13.99,
          categoryId: fingersCategory.id
        }
      ];

      console.log('\n🍗 Creating Finger menu items...');
      for (const item of fingerItems) {
        const created = await prisma.menuItem.create({
          data: item
        });
        console.log(`✅ Created: ${created.name} - $${created.basePrice}`);
      }
    } else {
      console.log(`ℹ️ Fingers category already has ${existingFingerItems.length} items`);
    }

    // Also create new Appetizer subcategories
    console.log('\n🍤 Creating Appetizer subcategories...');

    // Check for existing appetizer categories
    const existingFriedApp = await prisma.menuCategory.findUnique({
      where: { slug: 'fried-appetizers' }
    });
    const existingSoup = await prisma.menuCategory.findUnique({
      where: { slug: 'soups-chowders' }
    });
    const existingSpecialty = await prisma.menuCategory.findUnique({
      where: { slug: 'specialty-items' }
    });

    let friedAppetizerCategory, soupCategory, specialtyCategory;

    if (!existingFriedApp) {
      friedAppetizerCategory = await prisma.menuCategory.create({
        data: {
          name: 'Fried Appetizers',
          slug: 'fried-appetizers',
          description: 'Crispy fried appetizers and starters',
          isActive: true,
          sortOrder: 50,
        }
      });
      console.log('✅ Created Fried Appetizers category');
    } else {
      friedAppetizerCategory = existingFriedApp;
      console.log('ℹ️ Fried Appetizers category already exists');
    }

    if (!existingSoup) {
      soupCategory = await prisma.menuCategory.create({
        data: {
          name: 'Soups & Chowders',
          slug: 'soups-chowders',
          description: 'Warm soups and hearty chowders',
          isActive: true,
          sortOrder: 51,
        }
      });
      console.log('✅ Created Soups & Chowders category');
    } else {
      soupCategory = existingSoup;
      console.log('ℹ️ Soups & Chowders category already exists');
    }

    if (!existingSpecialty) {
      specialtyCategory = await prisma.menuCategory.create({
        data: {
          name: 'Specialty Items',
          slug: 'specialty-items',
          description: 'Unique specialty appetizers and snacks',
          isActive: true,
          sortOrder: 52,
        }
      });
      console.log('✅ Created Specialty Items category');
    } else {
      specialtyCategory = existingSpecialty;
      console.log('ℹ️ Specialty Items category already exists');
    }

    console.log('\n✅ Successfully processed all categories and menu items!');
    console.log('\nNew navbar structure ready:');
    console.log('🥪 Subs & Sandwiches');
    console.log('   ├── Cold Subs');
    console.log('   ├── Hot Subs');
    console.log('   ├── Steak & Cheese Subs');
    console.log('   └── Sandwiches');
    console.log('🦞 Seafood');
    console.log('   ├── Seafood Boxes');
    console.log('   ├── Seafood Rolls');
    console.log('   └── Seafood Plates');
    console.log('🍽️ Dinner');
    console.log('   ├── Dinner Plates');
    console.log('   └── Pasta & Italian');
    console.log('🍗 Chicken');
    console.log('   ├── Wings');
    console.log('   └── Fingers');
    console.log('🍤 Appetizers');
    console.log('   ├── Fried Appetizers');
    console.log('   ├── Soups & Chowders');
    console.log('   └── Specialty Items');
    console.log('🥗 Salads (standalone)');

  } catch (error) {
    console.error('❌ Error creating chicken categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChickenCategories();

createChickenCategories();
