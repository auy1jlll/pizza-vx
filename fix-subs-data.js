const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSubsData() {
  try {
    console.log('🛠️ Fixing missing subs and sandwiches data...');
    
    // Find the main Subs & Sandwiches category
    const mainSubsCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'subs-sandwiches' }
    });
    
    if (!mainSubsCategory) {
      console.log('❌ Main subs category not found!');
      return;
    }
    
    console.log(`✅ Found main category: ${mainSubsCategory.name} (ID: ${mainSubsCategory.id})`);
    
    // Create subcategories
    const subcategoriesData = [
      {
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Classic sandwiches and burgers',
        sortOrder: 6
      },
      {
        name: 'Hot Subs',
        slug: 'hot-subs', 
        description: 'Hot sandwiches and subs',
        sortOrder: 8
      },
      {
        name: 'Cold Subs',
        slug: 'cold-subs',
        description: 'Cold sandwiches and subs', 
        sortOrder: 9
      },
      {
        name: 'Steak and Cheese Subs',
        slug: 'steak-and-cheese-subs',
        description: 'Steak and cheese variations',
        sortOrder: 10
      }
    ];
    
    console.log('🏗️ Creating subcategories...');
    const createdSubcategories = {};
    
    for (const subcat of subcategoriesData) {
      const existing = await prisma.menuCategory.findFirst({
        where: { slug: subcat.slug }
      });
      
      if (existing) {
        console.log(`   ✅ Subcategory already exists: ${subcat.name}`);
        createdSubcategories[subcat.slug] = existing;
      } else {
        const created = await prisma.menuCategory.create({
          data: {
            ...subcat,
            parentCategoryId: mainSubsCategory.id,
            isActive: true
          }
        });
        console.log(`   ✅ Created subcategory: ${subcat.name}`);
        createdSubcategories[subcat.slug] = created;
      }
    }
    
    // Sample menu items for each subcategory
    const menuItemsData = [
      // Sandwiches
      {
        categorySlug: 'sandwiches',
        name: 'Super Beef on Onion Roll',
        description: 'Premium beef sandwich served on fresh onion roll',
        basePrice: 12.55,
        sortOrder: 1
      },
      {
        categorySlug: 'sandwiches', 
        name: 'Regular Beef on Sesame Roll',
        description: 'Classic beef sandwich served on sesame roll',
        basePrice: 11.55,
        sortOrder: 2
      },
      {
        categorySlug: 'sandwiches',
        name: 'Junior Beef',
        description: 'Smaller portion beef sandwich perfect for lighter appetites',
        basePrice: 10.55,
        sortOrder: 3
      },
      {
        categorySlug: 'sandwiches',
        name: 'Super Pastrami on Onion Roll', 
        description: 'Premium pastrami sandwich served on fresh onion roll',
        basePrice: 12.55,
        sortOrder: 4
      },
      {
        categorySlug: 'sandwiches',
        name: 'Regular Pastrami',
        description: 'Classic pastrami sandwich on your choice of bread',
        basePrice: 11.55,
        sortOrder: 5
      },
      {
        categorySlug: 'sandwiches',
        name: 'Haddock Sandwich (2pcs)',
        description: 'Two pieces of fresh haddock served on sesame bun', 
        basePrice: 16.30,
        sortOrder: 6
      },
      {
        categorySlug: 'sandwiches',
        name: 'Chicken Sandwich',
        description: 'Crispy chicken breast served with lettuce and tomato',
        basePrice: 8.55,
        sortOrder: 7
      },
      
      // Hot Subs
      {
        categorySlug: 'hot-subs',
        name: 'Steak Tips Kabob',
        description: 'Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll',
        basePrice: 16.75,
        sortOrder: 1
      },
      {
        categorySlug: 'hot-subs',
        name: 'Build your Own Roast Beef Sub',
        description: 'Start by choosing size sub, and add toppings',
        basePrice: 12.74,
        sortOrder: 2
      },
      {
        categorySlug: 'hot-subs',
        name: 'Chicken Cutlet Sub',
        description: 'Chicken cutlet in special batter fried in a large sub roll',
        basePrice: 13.00,
        sortOrder: 3
      },
      {
        categorySlug: 'hot-subs',
        name: 'Grilled Chicken Kabob',
        description: 'Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll',
        basePrice: 13.74,
        sortOrder: 4
      },
      {
        categorySlug: 'hot-subs',
        name: 'Cheese Burger',
        description: 'Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll',
        basePrice: 13.00,
        sortOrder: 5
      },
      {
        categorySlug: 'hot-subs',
        name: 'Chicken Fingers/tenders',
        description: 'Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll',
        basePrice: 13.00,
        sortOrder: 6
      },
      {
        categorySlug: 'hot-subs',
        name: 'Meat Ball Sub', 
        description: 'Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer',
        basePrice: 12.74,
        sortOrder: 8
      },
      {
        categorySlug: 'hot-subs',
        name: 'Hot Pastrami',
        description: 'Pastrami in a wrap or a 10" sub with options to make it your own',
        basePrice: 12.74,
        sortOrder: 9
      },
      {
        categorySlug: 'hot-subs',
        name: 'Eggplant',
        description: 'Fresh made to order Eggplant, you can choose it in a wrap or a sub roll',
        basePrice: 12.74,
        sortOrder: 11
      },
      {
        categorySlug: 'hot-subs',
        name: 'Veal Cutlet',
        description: 'Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll',
        basePrice: 12.74,
        sortOrder: 12
      },
      {
        categorySlug: 'hot-subs',
        name: 'Sausage sub',
        description: 'Fresh made to order Sausage, you can choose it in a wrap or a sub roll',
        basePrice: 12.74,
        sortOrder: 13
      },
      
      // Cold Subs
      {
        categorySlug: 'cold-subs',
        name: 'Italian Sub',
        description: 'Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots',
        basePrice: 12.74,
        sortOrder: 1
      },
      {
        categorySlug: 'cold-subs',
        name: 'American Sub',
        description: 'American Sub with Ham, Mortadella and American cheese',
        basePrice: 12.74,
        sortOrder: 2
      },
      {
        categorySlug: 'cold-subs',
        name: 'Ham Sub',
        description: 'Ham sub with your choice of cheese and toppings',
        basePrice: 12.74,
        sortOrder: 3
      },
      {
        categorySlug: 'cold-subs',
        name: 'Genoa Salami Sub',
        description: 'Imported Genoa Salami with many options to customize',
        basePrice: 12.74,
        sortOrder: 4
      },
      {
        categorySlug: 'cold-subs',
        name: 'Veggie Sub',
        description: 'Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions',
        basePrice: 12.74,
        sortOrder: 8
      },
      {
        categorySlug: 'cold-subs',
        name: 'Turkey Sub',
        description: 'Turkey sub with or without cheese but you can add veggies',
        basePrice: 12.74,
        sortOrder: 9
      },
      {
        categorySlug: 'cold-subs',
        name: 'BLT Sub',
        description: 'We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well',
        basePrice: 12.74,
        sortOrder: 10
      },
      
      // Steak and Cheese Subs
      {
        categorySlug: 'steak-and-cheese-subs',
        name: 'Steak Sub Build Your Own',
        description: 'Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments',
        basePrice: 12.25,
        sortOrder: 5
      }
    ];
    
    console.log('🍕 Creating menu items...');
    let createdCount = 0;
    
    for (const item of menuItemsData) {
      const category = createdSubcategories[item.categorySlug];
      if (!category) {
        console.log(`   ❌ Category not found for: ${item.categorySlug}`);
        continue;
      }
      
      const existing = await prisma.menuItem.findFirst({
        where: { 
          name: item.name,
          categoryId: category.id
        }
      });
      
      if (existing) {
        console.log(`   ✅ Item already exists: ${item.name}`);
      } else {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            categoryId: category.id,
            isActive: true,
            isAvailable: true,
            sortOrder: item.sortOrder
          }
        });
        createdCount++;
        console.log(`   ✅ Created item: ${item.name}`);
      }
    }
    
    console.log(`\\n🎉 Successfully created ${createdCount} new menu items!`);
    
    // Verify the results
    console.log('\\n🔍 Verification:');
    for (const [slug, category] of Object.entries(createdSubcategories)) {
      const itemCount = await prisma.menuItem.count({
        where: { categoryId: category.id }
      });
      console.log(`   ${category.name}: ${itemCount} items`);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  fixSubsData().catch(console.error);
}