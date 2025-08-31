const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateAdditionalMenuData() {
  console.log('Starting comprehensive menu data population...');

  try {
    // Create additional menu categories
    const categories = [
      { name: 'Dinner Plates', slug: 'dinner-plates', description: 'Hearty dinner plates with sides', sortOrder: 6 },
      { name: 'Seafood Plates', slug: 'seafood-plates', description: 'Fresh seafood plates with fries and sides', sortOrder: 7 },
      { name: 'Hot Subs', slug: 'hot-subs', description: 'Hot sandwiches and subs', sortOrder: 8 },
      { name: 'Cold Subs', slug: 'cold-subs', description: 'Cold sandwiches and subs', sortOrder: 9 },
      { name: 'Steak and Cheese Subs', slug: 'steak-and-cheese-subs', description: 'Steak and cheese variations', sortOrder: 10 },
      { name: 'Wings', slug: 'wings', description: 'Chicken wings in various flavors', sortOrder: 11 },
      { name: 'Fingers', slug: 'fingers', description: 'Chicken fingers and tenders', sortOrder: 12 },
      { name: 'Fried Appetizers', slug: 'fried-appetizers', description: 'Crispy fried appetizers', sortOrder: 13 },
      { name: 'Soups & Chowders', slug: 'soups-chowders', description: 'Hot soups and chowders', sortOrder: 14 },
      { name: 'Specialty Items', slug: 'specialty-items', description: 'Specialty sandwiches and items', sortOrder: 15 }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const created = await prisma.menuCategory.upsert({
        where: { name: category.name },
        update: category,
        create: category
      });
      createdCategories.push(created);
      console.log(`Created category: ${category.name}`);
    }

    // Create menu items for each category
    const menuItems = [
      // Dinner Plates
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Gyro Plate',
        description: 'Traditional Greek gyro with tzatziki sauce, served with fries and Greek salad',
        basePrice: 17.25,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Hamburger Plate',
        description: 'Juicy hamburger patty with lettuce, tomato, onion, served with fries',
        basePrice: 14.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Cheeseburger Plate',
        description: 'Hamburger with American cheese, lettuce, tomato, onion, served with fries',
        basePrice: 15.99,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Chicken Kabob Plate',
        description: 'Grilled chicken kabob with rice, salad, and tzatziki sauce',
        basePrice: 16.50,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Chicken Wings Plate',
        description: '8 pieces of chicken wings with fries and coleslaw',
        basePrice: 15.99,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Chicken Fingers Plate',
        description: 'Chicken fingers with fries and choice of dipping sauce',
        basePrice: 14.99,
        sortOrder: 6
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Roast Beef Plate',
        description: 'Sliced roast beef with mashed potatoes and gravy',
        basePrice: 16.99,
        sortOrder: 7
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Steak Tip Kabob Plate',
        description: 'Grilled steak tips with rice, salad, and tzatziki sauce',
        basePrice: 18.99,
        sortOrder: 8
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Dinner Plates').id,
        name: 'Fish \'n Chips',
        description: 'Beer-battered haddock with fries and coleslaw',
        basePrice: 15.99,
        sortOrder: 9
      },

      // Seafood Plates
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Sea Monster (Scallops, Clams, Shrimps & Haddock)',
        description: 'Fresh Haddock, scallops, shrimps and clams it is HUGE good for two people, comes with french fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 46.00,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Scallops Plate',
        description: 'A plate of scallops fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 41.50,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Haddock Plate',
        description: 'A huge piece of haddock fish on a bed of french fries and onion rings and a choice of pasta or coleslaw',
        basePrice: 33.50,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: '2-way Scallops & Clams Plate',
        description: 'Best of the Sea.. scallops and Native clams, piled on onion rings and french fries with a choice of coleslaw or pasta salad',
        basePrice: 37.50,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: '3-way Shrimps, Scallops & Clams Plate',
        description: 'A fresh pile of shrimps, scallops and clams piled on onion rings and french fries with a side of coleslaw or pasta salad',
        basePrice: 38.95,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Strip Clams Plate',
        description: 'Strip clams deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 21.50,
        sortOrder: 6
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Shrimps Plate',
        description: 'Fresh shrimps deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 24.50,
        sortOrder: 7
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Seafood Plates').id,
        name: 'Native Clams Plate',
        description: 'Fresh locally sourced clams with an option of pasta salad or coleslaw on a bed of french fries and onion rings',
        basePrice: 42.00,
        sortOrder: 8
      },

      // Hot Subs
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Build your Own Roast Beef Sub',
        description: 'Start by choosing size sub, and add toppings',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Chicken Cutlet Sub',
        description: 'Chicken cutlet in special batter fried in a large sub roll.',
        basePrice: 12.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Grilled Chicken Kabob',
        description: 'Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Steak Tips Kabob',
        description: 'Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll',
        basePrice: 15.99,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Cheese Burger',
        description: 'Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Chicken Fingers/tenders',
        description: 'Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        sortOrder: 6
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Chicken Caesar Wrap',
        description: 'Fresh made to order Grilled Chicken, you can choose the type of wrap.',
        basePrice: 14.50,
        sortOrder: 7
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Meat Ball Sub',
        description: 'Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer',
        basePrice: 11.99,
        sortOrder: 8
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Hot Pastrami',
        description: 'Pastrami in a warp or a 10" sub with options to make it your own',
        basePrice: 12.99,
        sortOrder: 9
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Hot Veggies',
        description: 'Fresh made to order Grilled Veggies, (grilled Mushroom, peppers and onions)',
        basePrice: 12.99,
        sortOrder: 10
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Eggplant',
        description: 'Fresh made to order Eggplant, you can choose it in a wrap or a sub roll',
        basePrice: 12.25,
        sortOrder: 11
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Veal Cutlet',
        description: 'Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        sortOrder: 12
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Hot Subs').id,
        name: 'Sausage sub',
        description: 'Fresh made to order Sausage, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        sortOrder: 13
      },

      // Cold Subs
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Italian Sub',
        description: 'Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'American Sub',
        description: 'American Sub with Ham, Mortadella and American cheese.',
        basePrice: 11.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Imported Ham',
        description: 'Imported Ham add cheese and veggies to make it your way',
        basePrice: 11.99,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Genoa Salami Sub',
        description: 'Imported Genoa Salami with many options to customize',
        basePrice: 11.99,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Tuna Salad',
        description: 'Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up',
        basePrice: 11.99,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Chicken Salad',
        description: 'Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings',
        basePrice: 11.99,
        sortOrder: 6
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Crab Meat',
        description: 'Crab meat salad, select your size and your type of bread',
        basePrice: 11.99,
        sortOrder: 7
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Veggie Sub',
        description: 'Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions',
        basePrice: 11.99,
        sortOrder: 8
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'Turkey Sub',
        description: 'Turkey sub with or without cheese but you can add veggies',
        basePrice: 11.99,
        sortOrder: 9
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Cold Subs').id,
        name: 'BLT Sub',
        description: 'We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well.',
        basePrice: 11.99,
        sortOrder: 10
      },

      // Steak and Cheese Subs
      {
        categoryId: createdCategories.find(c => c.name === 'Steak and Cheese Subs').id,
        name: 'Steak Bomb',
        description: 'Steak and Cheese with Grilled peppers, Onions, mushrooms and american cheese',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Steak and Cheese Subs').id,
        name: 'Pepper Cheese Steak',
        description: 'Steak and Cheese with Grilled peppers',
        basePrice: 11.50,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Steak and Cheese Subs').id,
        name: 'Onion Cheese Steak',
        description: 'Steak and Cheese with Grilled onions',
        basePrice: 11.50,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Steak and Cheese Subs').id,
        name: 'Mushroom Cheese Steak',
        description: 'Steak and Cheese with Mushroom',
        basePrice: 11.50,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Steak and Cheese Subs').id,
        name: 'Steak Sub Build Your Own',
        description: 'Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments',
        basePrice: 11.50,
        sortOrder: 5
      },

      // Wings
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'Buffalo Wings (6 pcs)',
        description: 'Classic buffalo wings with hot sauce',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'BBQ Wings (6 pcs)',
        description: 'Sweet and tangy BBQ wings',
        basePrice: 11.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'Regular Wings (6 pcs)',
        description: 'Classic regular wings',
        basePrice: 11.99,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'Buffalo Wings (12 pcs)',
        description: 'Classic buffalo wings with hot sauce',
        basePrice: 21.99,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'BBQ Wings (12 pcs)',
        description: 'Sweet and tangy BBQ wings',
        basePrice: 21.99,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Wings').id,
        name: 'Regular Wings (12 pcs)',
        description: 'Classic regular wings',
        basePrice: 21.99,
        sortOrder: 6
      },

      // Fingers
      {
        categoryId: createdCategories.find(c => c.name === 'Fingers').id,
        name: 'Chicken Tenders (3 pcs)',
        description: 'Crispy breaded chicken tenders',
        basePrice: 7.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fingers').id,
        name: 'Chicken Tenders (5 pcs)',
        description: 'Crispy breaded chicken tenders',
        basePrice: 12.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fingers').id,
        name: 'Buffalo Chicken Tenders (5 pcs)',
        description: 'Crispy tenders tossed in buffalo sauce',
        basePrice: 13.99,
        sortOrder: 3
      },

      // Fried Appetizers
      {
        categoryId: createdCategories.find(c => c.name === 'Fried Appetizers').id,
        name: 'Mozzarella Sticks (6 pcs)',
        description: 'Golden fried mozzarella with marinara sauce',
        basePrice: 6.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fried Appetizers').id,
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        basePrice: 5.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fried Appetizers').id,
        name: 'Jalapeño Poppers (6 pcs)',
        description: 'Cream cheese stuffed jalapeños, breaded and fried',
        basePrice: 7.49,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fried Appetizers').id,
        name: 'Fried Pickles',
        description: 'Beer-battered dill pickle spears',
        basePrice: 6.49,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Fried Appetizers').id,
        name: 'Loaded Potato Skins (4 pcs)',
        description: 'Crispy potato skins with cheese, bacon, and sour cream',
        basePrice: 8.99,
        sortOrder: 5
      },

      // Soups & Chowders
      {
        categoryId: createdCategories.find(c => c.name === 'Soups & Chowders').id,
        name: 'New England Clam Chowder',
        description: 'Creamy clam chowder with tender clams and potatoes',
        basePrice: 4.99,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Soups & Chowders').id,
        name: 'Seafood Bisque',
        description: 'Rich and creamy seafood bisque',
        basePrice: 5.99,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Soups & Chowders').id,
        name: 'Fish Chowder',
        description: 'Traditional New England fish chowder',
        basePrice: 4.99,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Soups & Chowders').id,
        name: 'Lobster Bisque',
        description: 'Premium lobster bisque with real lobster meat',
        basePrice: 7.99,
        sortOrder: 4
      },

      // Specialty Items
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Haddock Sandwich (2pcs)',
        description: 'You get 2 Pcs of Haddock on a sesame bun',
        basePrice: 15.75,
        sortOrder: 1
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Reuben on Rye',
        description: 'Reuben on Rye topped with sauerkraut and 1000 island dressing',
        basePrice: 12.50,
        sortOrder: 2
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Gyro',
        description: 'Greek Gyro on special Pita bread comes with onion, tomatoes and Tzatziki sauce',
        basePrice: 10.50,
        sortOrder: 3
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Hot Dog',
        description: 'Everybody loves a hot dog, it comes topped with onions and mustard on a frankfurter.',
        basePrice: 5.75,
        sortOrder: 4
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Hot Pastrami',
        description: 'Start by choosing size Sandwich (Reg on Sesame @ Super on Onion Roll), and add toppings',
        basePrice: 11.00,
        sortOrder: 5
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Chicken Sandwich',
        description: 'Select your Chicken and add cheese and toppings as you wish',
        basePrice: 8.00,
        sortOrder: 6
      },
      {
        categoryId: createdCategories.find(c => c.name === 'Specialty Items').id,
        name: 'Hamburger',
        description: 'Select your burger and add cheese and toppings as you wish',
        basePrice: 7.25,
        sortOrder: 7
      }
    ];

    for (const item of menuItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: item.categoryId
        }
      });

      if (existingItem) {
        // Update existing item
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: item
        });
        console.log(`Updated menu item: ${item.name}`);
      } else {
        // Create new item
        await prisma.menuItem.create({
          data: item
        });
        console.log(`Created menu item: ${item.name}`);
      }
    }

    console.log('Comprehensive menu data population completed successfully!');
    console.log(`Created ${categories.length} categories and ${menuItems.length} menu items`);

  } catch (error) {
    console.error('Error populating menu data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population script
populateAdditionalMenuData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
