const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleMenuItems() {
  try {
    console.log('Creating sample menu items...');

    // First, get categories
    const categories = await prisma.menuCategory.findMany();
    console.log('Found categories:', categories.map(c => c.name));

    if (categories.length === 0) {
      console.log('No categories found. Please create categories first.');
      return;
    }

    // Create sample items for each category
    const sampleItems = [
      {
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
        basePrice: 12.99,
        categoryId: categories[0]?.id,
        preparationTime: 15
      },
      {
        name: 'Grilled Chicken Sandwich',
        description: 'Tender grilled chicken breast with mayo and fresh vegetables',
        basePrice: 11.99,
        categoryId: categories[0]?.id,
        preparationTime: 12
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan cheese and caesar dressing',
        basePrice: 9.99,
        categoryId: categories[1]?.id || categories[0]?.id,
        preparationTime: 8
      },
      {
        name: 'Garden Salad',
        description: 'Mixed greens with tomatoes, cucumbers, and your choice of dressing',
        basePrice: 8.99,
        categoryId: categories[1]?.id || categories[0]?.id,
        preparationTime: 6
      }
    ];

    for (const item of sampleItems) {
      if (item.categoryId) {
        const created = await prisma.menuItem.create({
          data: item
        });
        console.log(`Created item: ${created.name} - $${created.basePrice}`);
      }
    }

    console.log('Sample menu items created successfully!');

  } catch (error) {
    console.error('Error creating menu items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleMenuItems();
