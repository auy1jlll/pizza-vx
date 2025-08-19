const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSideOrdersCategory() {
  try {
    console.log('🍟 Starting Side Orders category creation...');

    // Check if Side Orders category already exists
    let sideOrdersCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Side Orders' }
    });

    if (sideOrdersCategory) {
      console.log('📂 Side Orders category already exists, using existing category...');
    } else {
      // Create Side Orders category
      sideOrdersCategory = await prisma.menuCategory.create({
        data: {
          name: 'Side Orders',
          slug: 'side-orders',
          description: 'Select From A Variety Of Side Orders, Options Include Chicken Wings, French Fries, Onion Rings And More',
          sortOrder: 7,
          isActive: true
        }
      });
      console.log('✅ Side Orders category created:', sideOrdersCategory.name);
    }

    // Side Orders menu items with authentic pricing
    const sideOrdersItems = [
      {
        name: 'BBQ Chicken Fingers',
        description: 'Tender chicken fingers coated in barbecue sauce',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'A Cup of Chili',
        description: 'Hearty cup of homemade chili (D)',
        price: 7.00,
        category: 'Side Orders'
      },
      {
        name: 'Chicken Noodle Soup',
        description: 'Classic chicken noodle soup (D)',
        price: 7.00,
        category: 'Side Orders'
      },
      {
        name: 'Clam Chowder',
        description: 'New England style clam chowder (D)',
        price: 9.50,
        category: 'Side Orders'
      },
      {
        name: 'Haddock Chowder',
        description: 'Fresh haddock chowder (D)',
        price: 9.50,
        category: 'Side Orders'
      },
      {
        name: 'Fried Raviolis',
        description: 'Golden fried raviolis served with marinara sauce',
        price: 9.00,
        category: 'Side Orders'
      },
      {
        name: 'Fried Mushrooms',
        description: 'Breaded and fried mushrooms',
        price: 9.00,
        category: 'Side Orders'
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Breaded mozzarella sticks with marinara sauce',
        price: 9.00,
        category: 'Side Orders'
      },
      {
        name: 'Spinach Egg Roll',
        description: 'Crispy egg roll filled with spinach',
        price: 4.50,
        category: 'Side Orders'
      },
      {
        name: 'Pizza Egg Roll',
        description: 'Unique egg roll with pizza flavors',
        price: 4.50,
        category: 'Side Orders'
      },
      {
        name: 'French Fries - Small',
        description: 'Crispy golden french fries',
        price: 6.00,
        category: 'Side Orders'
      },
      {
        name: 'French Fries - Large',
        description: 'Large order of crispy golden french fries',
        price: 7.00,
        category: 'Side Orders'
      },
      {
        name: 'Buffalo Chicken Fingers',
        description: 'Spicy buffalo chicken fingers with ranch or blue cheese',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'Buffalo Chicken Wings',
        description: 'Traditional buffalo wings with celery and blue cheese',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'BBQ Chicken Wings',
        description: 'Chicken wings glazed in barbecue sauce',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'Chicken Wings',
        description: 'Classic chicken wings',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'Chicken Fingers',
        description: 'Tender breaded chicken fingers',
        price: 11.99,
        category: 'Side Orders'
      },
      {
        name: 'Pasta Salad - Small',
        description: 'Fresh pasta salad',
        price: 5.00,
        category: 'Side Orders'
      },
      {
        name: 'Pasta Salad - Large',
        description: 'Large serving of fresh pasta salad',
        price: 9.00,
        category: 'Side Orders'
      },
      {
        name: 'Coleslaw - Small',
        description: 'Fresh creamy coleslaw',
        price: 5.00,
        category: 'Side Orders'
      },
      {
        name: 'Coleslaw - Large',
        description: 'Large serving of fresh creamy coleslaw',
        price: 9.00,
        category: 'Side Orders'
      },
      {
        name: 'Onion Rings - Small',
        description: 'Crispy breaded onion rings',
        price: 6.00,
        category: 'Side Orders'
      },
      {
        name: 'Onion Rings - Large',
        description: 'Large order of crispy breaded onion rings',
        price: 7.00,
        category: 'Side Orders'
      }
    ];

    console.log('🍗 Creating Side Orders menu items...');

    // Create all side orders items
    for (const item of sideOrdersItems) {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.price,
          categoryId: sideOrdersCategory.id,
          isActive: true,
          sortOrder: sideOrdersItems.indexOf(item) + 1
        }
      });

      console.log(`✅ Created: ${menuItem.name} - $${menuItem.basePrice}`);
    }

    console.log('\n📊 Side Orders Summary:');
    console.log(`📂 Category: ${sideOrdersCategory.name}`);
    console.log(`🍟 Items Created: ${sideOrdersItems.length}`);
    console.log(`💰 Price Range: $4.50 - $11.99`);
    
    // Show variety breakdown
    const soups = sideOrdersItems.filter(item => item.name.toLowerCase().includes('soup') || item.name.toLowerCase().includes('chowder') || item.name.toLowerCase().includes('chili')).length;
    const chicken = sideOrdersItems.filter(item => item.name.toLowerCase().includes('chicken')).length;
    const fried = sideOrdersItems.filter(item => item.name.toLowerCase().includes('fried') || item.name.toLowerCase().includes('fries') || item.name.toLowerCase().includes('rings')).length;
    const salads = sideOrdersItems.filter(item => item.name.toLowerCase().includes('salad') || item.name.toLowerCase().includes('coleslaw')).length;
    
    console.log('\n🎯 Variety Breakdown:');
    console.log(`🍲 Soups & Chowders: ${soups} items`);
    console.log(`🍗 Chicken Items: ${chicken} items`);
    console.log(`🍟 Fried Items: ${fried} items`);
    console.log(`🥗 Salads & Slaws: ${salads} items`);
    
    console.log('\n🎉 Side Orders category creation completed successfully!');

  } catch (error) {
    console.error('❌ Error creating Side Orders category:', error);
    
    if (error.code === 'P2002') {
      console.error('📝 Note: Category or items may already exist. Check for duplicates.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

addSideOrdersCategory();
