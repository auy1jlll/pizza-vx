const { PrismaClient } = require('@prisma/client');

async function createGreenlandFamousMenu() {
  const prisma = new PrismaClient();

  try {
    console.log('🍽️ Creating authentic Greenland Famous menu...');
    
    // First, let's clear existing menu data to start fresh
    console.log('📝 Clearing existing menu data...');
    await prisma.menuItem.deleteMany({});
    await prisma.menuCategory.deleteMany({});
    
    // Categories based on their website structure
    const categories = [
      {
        name: 'Roast Beef',
        slug: 'roast-beef',
        description: 'Our Specialty Items And Famous! For Best In Town Roast Beef.',
        sortOrder: 1
      },
      {
        name: 'Specialty Pizza',
        slug: 'specialty-pizza',
        description: 'Choose From Our House Speciality With Big Taste For The Whole Family',
        sortOrder: 2
      },
      {
        name: 'Salads',
        slug: 'salads',
        description: 'Our Salad Is Made Fresh To Order From Mixed Greens, Tomatoes, Red Onions, Green Peppers',
        sortOrder: 3
      },
      {
        name: 'Seafood',
        slug: 'seafood',
        description: 'Fresh New England seafood including our famous Sea Monster platter',
        sortOrder: 4
      },
      {
        name: 'Chicken',
        slug: 'chicken',
        description: 'Wings, tenders, and chicken dinners',
        sortOrder: 5
      },
      {
        name: 'Pasta',
        slug: 'pasta',
        description: 'Fresh pasta dishes with homemade sauces',
        sortOrder: 6
      }
    ];

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = {};
    for (const category of categories) {
      const created = await prisma.menuCategory.create({
        data: category
      });
      createdCategories[category.slug] = created.id;
      console.log(`✅ Created category: ${category.name}`);
    }

    // Menu items based on their actual website
    const menuItems = [
      // ROAST BEEF CATEGORY
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef 3-Way (Junior)',
        description: 'This amazing sandwich comes with Mayonnaise, Special BBQ Sauce, American Cheese and loaded with Roast beef cooked to a perfect rare',
        basePrice: 10.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef 3-Way (Regular)',
        description: 'Regular size on sesame bun with Mayonnaise, Special BBQ Sauce, American Cheese and loaded with Roast beef cooked to a perfect rare',
        basePrice: 11.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef 3-Way (Super)',
        description: 'Super size on onion roll with Mayonnaise, Special BBQ Sauce, American Cheese and loaded with Roast beef cooked to a perfect rare',
        basePrice: 12.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Sandwich (Junior)',
        description: 'Start by choosing size sandwich and add toppings',
        basePrice: 10.25,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Sandwich (Regular)',
        description: 'Start by choosing size sandwich and add toppings',
        basePrice: 11.25,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Sandwich (Super)',
        description: 'Start by choosing size sandwich and add toppings',
        basePrice: 12.25,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Sub (Regular)',
        description: 'Start by choosing size sub, and add toppings',
        basePrice: 11.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Sub (Large)',
        description: 'Large sub with roast beef and your choice of toppings',
        basePrice: 12.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Roast Beef Dinner',
        description: 'Slow cooked Roast Beef sandwich served with french fries, onion rings and a choice of pasta salad or coleslaw',
        basePrice: 17.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Steak Tips Kabob',
        description: 'Marinated steak tips grilled to perfections served on 10″ sub with your favorite toppings',
        basePrice: 19.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['roast-beef'],
        name: 'Steak & Cheese Sub',
        description: 'Shaved steak grilled, cheese added with your choices of grilled onions, pepper and mushrooms',
        basePrice: 11.50,
        isAvailable: true
      },

      // SPECIALTY PIZZA CATEGORY
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Chicken Alfredo Pizza (Small)',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        basePrice: 15.45,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Chicken Alfredo Pizza (Large)',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        basePrice: 22.45,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'BBQ Chicken Pizza (Small)',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'BBQ Chicken Pizza (Large)',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        basePrice: 23.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'House Special Pizza (Small)',
        description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'House Special Pizza (Large)',
        description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
        basePrice: 23.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Buffalo Chicken Pizza (Small)',
        description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Buffalo Chicken Pizza (Large)',
        description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
        basePrice: 23.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Meat Lovers Pizza (Small)',
        description: 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Meat Lovers Pizza (Large)',
        description: '10″ pie Loaded with meatballs, Sausage, Ham, Salami, Pepperoni and Bacon',
        basePrice: 23.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Athenian Pizza (Small)',
        description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Athenian Pizza (Large)',
        description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
        basePrice: 23.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Veggie Pizza (Small)',
        description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
        basePrice: 16.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['specialty-pizza'],
        name: 'Veggie Pizza (Large)',
        description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
        basePrice: 23.50,
        isAvailable: true
      },

      // SALADS CATEGORY
      {
        categoryId: createdCategories['salads'],
        name: 'Build Your Own Salad',
        description: 'Start with (Garden Salad) Fresh mixed greens, red onions, cherry tomatoes, Bell peppers and cucumbers, then add your favorite toppings/protein',
        basePrice: 9.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['salads'],
        name: 'Caesar Salad',
        description: 'Fresh Romaine lettuce, Croutons and aged shaved parmesan cheese',
        basePrice: 11.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['salads'],
        name: 'Chef Salad',
        description: 'Fresh mixed greens, ham, turkey, salami and a scoop of tuna salad',
        basePrice: 13.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['salads'],
        name: 'California Salad',
        description: 'Fresh mixed greens, Cherry tomatoes, red onions, cucumbers, fresh mozzarella balls and avocado',
        basePrice: 12.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['salads'],
        name: 'Greek Salad',
        description: 'Fresh mixed greens, Kalamata olives, feta cheese, cucumbers, bell peppers, red onions and cherry tomatoes',
        basePrice: 11.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['salads'],
        name: 'Lobster Salad',
        description: 'Fresh mixed greens, with our local lobster',
        basePrice: 38.00,
        isAvailable: true
      },

      // SEAFOOD CATEGORY
      {
        categoryId: createdCategories['seafood'],
        name: 'Sea Monster Platter',
        description: 'Call it a Sea Monster or just a big seafood platter that comes with 2 pcs of haddock, clams, scallops, shrimps on a bed of fries and onion rings',
        basePrice: 32.99, // Market price - estimated
        isAvailable: true
      },
      {
        categoryId: createdCategories['seafood'],
        name: 'Haddock Sandwich',
        description: '2 large pcs of haddock fish cooked to perfection, on a sesame bun',
        basePrice: 15.75,
        isAvailable: true
      },
      {
        categoryId: createdCategories['seafood'],
        name: 'Clam Chowder Bowl',
        description: 'Locally sourced clams chowder available daily',
        basePrice: 9.50,
        isAvailable: true
      },
      {
        categoryId: createdCategories['seafood'],
        name: 'Native Clams',
        description: 'Great and fresh New England clams',
        basePrice: 18.99, // Seasonally priced - estimated
        isAvailable: true
      },

      // CHICKEN CATEGORY
      {
        categoryId: createdCategories['chicken'],
        name: 'Chicken Wings',
        description: 'Wings with your favorite sauce buffalo, BBQ or just the way they are!',
        basePrice: 11.99,
        isAvailable: true
      },
      {
        categoryId: createdCategories['chicken'],
        name: 'Chicken Kabob Dinner',
        description: 'Tons of fries, rings a side of coleslaw or pasta salad',
        basePrice: 17.50,
        isAvailable: true
      },

      // PASTA CATEGORY
      {
        categoryId: createdCategories['pasta'],
        name: 'Chicken Broccoli Alfredo Ziti',
        description: 'home made Alfredo, fresh steamed broccoli on a bed of Ziti pasta',
        basePrice: 11.50,
        isAvailable: true
      }
    ];

    // Create menu items
    console.log('🍽️ Creating menu items...');
    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: item
      });
      console.log(`✅ Created: ${item.name} - $${item.basePrice}`);
    }

    console.log('\n🎉 Greenland Famous menu created successfully!');
    
    // Get summary
    const categoryCount = await prisma.menuCategory.count();
    const itemCount = await prisma.menuItem.count();
    
    console.log(`\n📊 Menu Summary:`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Menu Items: ${itemCount}`);
    
    // Show categories and item counts
    const categoriesWithCounts = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`\n📋 Categories:`);
    categoriesWithCounts.forEach(cat => {
      console.log(`   ${cat.name}: ${cat._count.menuItems} items`);
    });

    console.log(`\n🌟 Featured Items:`);
    console.log(`   • Roast Beef 3-Way (Their signature dish!)`);
    console.log(`   • Sea Monster Platter (Huge seafood combo)`);
    console.log(`   • House Special Pizza (Loaded with everything)`);
    console.log(`   • Lobster Salad (Premium local lobster)`);
    
  } catch (error) {
    console.error('❌ Error creating menu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createGreenlandFamousMenu();
