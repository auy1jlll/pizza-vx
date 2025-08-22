const { PrismaClient } = require('@prisma/client');

async function seedSaladData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🥗 Starting to seed Salad category and menu items...\n');
    
    // Create Salads category
    const saladCategory = await prisma.menuCategory.create({
      data: {
        name: 'Salads',
        slug: 'salads',
        description: 'Our Salad Is Made Fresh To Order From Mixed Greens, Tomatoes, Red Onions, Green Peppers, Also Romaine Lettuce For Caesar Salads',
        isActive: true,
        sortOrder: 1
      }
    });
    
    console.log('✅ Created Salads category:', saladCategory.name);
    
    // Create salad menu items
    const saladItems = [
      {
        name: 'BUILD YOUR OWN SALAD',
        description: 'Start with Garden Salad (Fresh mixed greens, red onions, cherry tomatoes, Bell peppers and cucumbers), then add your favorite toppings/protein.',
        basePrice: 9.75,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 1
      },
      {
        name: 'CAESAR SALAD',
        description: 'Fresh Romaine lettuce, Croutons and aged shaved parmesan cheese',
        basePrice: 11.50,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 2
      },
      {
        name: 'CHEF SALAD',
        description: 'Fresh mixed greens, ham, turkey, salami and a scoop of tuna salad.',
        basePrice: 13.75,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 3
      },
      {
        name: 'CALIFORNIA SALAD',
        description: 'Fresh mixed greens, Cherry tomatoes, red onions, cucumbers, fresh mozzarella balls and avocado.',
        basePrice: 12.99,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 4
      },
      {
        name: 'GREEK SALAD',
        description: 'Fresh mixed greens, Kalamata olives, feta cheese, cucumbers, bell peppers, red onions and cherry tomatoes.',
        basePrice: 11.75,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 5
      },
      {
        name: 'SALAD WITH LOBSTER',
        description: 'Fresh mixed greens, with our local lobster',
        basePrice: 38.00,
        categoryId: saladCategory.id,
        isActive: true,
        isAvailable: true,
        sortOrder: 6
      }
    ];
    
    console.log('\n📝 Creating salad menu items...');
    
    for (const item of saladItems) {
      const createdItem = await prisma.menuItem.create({
        data: item
      });
      console.log(`✅ ${createdItem.name} - $${createdItem.basePrice}`);
    }
    
    console.log('\n🎉 Successfully seeded Salad category with all menu items!');
    console.log(`📊 Total items created: ${saladItems.length}`);
    
    // Verify the data
    const categoryWithItems = await prisma.menuCategory.findUnique({
      where: { id: saladCategory.id },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    console.log('\n📋 Verification:');
    console.log(`Category: ${categoryWithItems.name}`);
    console.log(`Items: ${categoryWithItems.menuItems.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding salad data:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSaladData();
