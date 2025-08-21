const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addGreenlandFamousMenu() {
  try {
    console.log('🏪 Adding Greenland Famous Menu - Batch Import...\n');

    // Get current max sort order for categories
    const existingCategories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'desc' },
      take: 1
    });
    let maxCategorySortOrder = existingCategories.length > 0 ? existingCategories[0].sortOrder : 0;

    // Define all categories and their items
    const menuData = [
      {
        category: {
          name: 'Signature Roast Beef',
          slug: 'signature-roast-beef',
          description: 'Our famous specialty and most popular roast beef items - Home of the Three-way!',
          sortOrder: ++maxCategorySortOrder
        },
        items: [
          {
            name: 'Most Popular Roast Beef 3-way',
            description: 'Our signature dish with mayo, special BBQ sauce, American cheese, and perfectly cooked rare roast beef',
            basePrice: 1075, // $10.75
            preparationTime: 12,
            sortOrder: 1
          },
          {
            name: 'Jr Beef 3-way',
            description: 'Junior size of our famous 3-way with mayo, special BBQ sauce, American cheese, and rare roast beef',
            basePrice: 1175, // $11.75
            preparationTime: 10,
            sortOrder: 2
          },
          {
            name: 'Reg on Sesame 3-way',
            description: 'Regular 3-way on sesame bun with mayo, special BBQ sauce, American cheese, and rare roast beef',
            basePrice: 1275, // $12.75
            preparationTime: 12,
            sortOrder: 3
          },
          {
            name: 'Super Onion Roll 3-way',
            description: 'Super size 3-way on onion roll with mayo, special BBQ sauce, American cheese, and rare roast beef',
            basePrice: 1075, // $10.75
            preparationTime: 15,
            sortOrder: 4
          },
          {
            name: 'Junior Roast Beef Sandwich',
            description: 'Build-your-own junior roast beef sandwich with choice of toppings',
            basePrice: 1025, // $10.25
            preparationTime: 8,
            sortOrder: 5
          },
          {
            name: 'Regular Roast Beef Sandwich',
            description: 'Build-your-own regular roast beef sandwich with choice of toppings',
            basePrice: 1125, // $11.25
            preparationTime: 10,
            sortOrder: 6
          },
          {
            name: 'Super Roast Beef Sandwich',
            description: 'Build-your-own super roast beef sandwich with choice of toppings',
            basePrice: 1225, // $12.25
            preparationTime: 12,
            sortOrder: 7
          },
          {
            name: 'Regular Roast Beef Sub',
            description: 'Regular roast beef sub with choice of toppings',
            basePrice: 1199, // $11.99
            preparationTime: 10,
            sortOrder: 8
          },
          {
            name: 'Large Roast Beef Sub',
            description: 'Large roast beef sub with choice of toppings',
            basePrice: 1299, // $12.99
            preparationTime: 12,
            sortOrder: 9
          }
        ]
      },
      {
        category: {
          name: 'Chicken & Wings',
          slug: 'chicken-wings',
          description: 'Wings, fingers, and chicken specialties - all made fresh to order',
          sortOrder: ++maxCategorySortOrder
        },
        items: [
          {
            name: 'Buffalo Chicken Wings',
            description: 'Fresh chicken wings tossed in buffalo sauce',
            basePrice: 1199, // $11.99
            preparationTime: 15,
            sortOrder: 1
          },
          {
            name: 'BBQ Chicken Wings',
            description: 'Fresh chicken wings tossed in BBQ sauce',
            basePrice: 1199, // $11.99
            preparationTime: 15,
            sortOrder: 2
          },
          {
            name: 'Regular Chicken Wings',
            description: 'Fresh chicken wings served plain or with sauce on the side',
            basePrice: 1199, // $11.99
            preparationTime: 15,
            sortOrder: 3
          },
          {
            name: 'Buffalo Chicken Fingers',
            description: 'Hand-breaded chicken tenders tossed in buffalo sauce',
            basePrice: 1199, // $11.99
            preparationTime: 12,
            sortOrder: 4
          },
          {
            name: 'BBQ Chicken Fingers',
            description: 'Hand-breaded chicken tenders tossed in BBQ sauce',
            basePrice: 1199, // $11.99
            preparationTime: 12,
            sortOrder: 5
          },
          {
            name: 'Regular Chicken Fingers',
            description: 'Hand-breaded chicken tenders served plain or with sauce on the side',
            basePrice: 1199, // $11.99
            preparationTime: 12,
            sortOrder: 6
          }
        ]
      },
      {
        category: {
          name: 'Fresh Seafood',
          slug: 'fresh-seafood',
          description: 'Fresh New England seafood specialties and locally sourced chowders',
          sortOrder: ++maxCategorySortOrder
        },
        items: [
          {
            name: 'Sea Monster Platter',
            description: '2 pieces haddock, clams, scallops, and shrimp on a bed of fries and onion rings',
            basePrice: 2499, // Estimated $24.99
            preparationTime: 18,
            sortOrder: 1
          },
          {
            name: 'Fish & Chips',
            description: '2 large pieces of haddock cooked to perfection, served with fries',
            basePrice: 1599, // Estimated $15.99
            preparationTime: 15,
            sortOrder: 2
          },
          {
            name: 'Locally Sourced Clam Chowder',
            description: 'Fresh New England clam chowder made with locally sourced clams',
            basePrice: 950, // $9.50
            preparationTime: 5,
            sortOrder: 3
          },
          {
            name: 'Haddock Chowder',
            description: 'Creamy haddock chowder made fresh daily',
            basePrice: 950, // $9.50
            preparationTime: 5,
            sortOrder: 4
          }
        ]
      },
      {
        category: {
          name: 'Hot Subs & Sandwiches',
          slug: 'hot-subs-sandwiches',
          description: 'Specialty hot subs and sandwiches beyond our famous roast beef',
          sortOrder: ++maxCategorySortOrder
        },
        items: [
          {
            name: 'Steak & Cheese Sub',
            description: 'Shaved steak with cheese and choice of grilled onions, peppers, or mushrooms',
            basePrice: 1299, // Estimated $12.99
            preparationTime: 12,
            sortOrder: 1
          },
          {
            name: 'Marinated Steak Tips Sub',
            description: 'Grilled marinated steak tips on 10" sub with your favorite toppings',
            basePrice: 1399, // Estimated $13.99
            preparationTime: 15,
            sortOrder: 2
          },
          {
            name: 'Hot Pastrami Sandwich',
            description: 'Hot sliced pastrami with mustard and pickles on your choice of bread',
            basePrice: 1099, // Estimated $10.99
            preparationTime: 10,
            sortOrder: 3
          },
          {
            name: 'Philly Cheese Steak',
            description: 'Classic Philly-style steak and cheese with grilled onions and peppers',
            basePrice: 1299, // Estimated $12.99
            preparationTime: 12,
            sortOrder: 4
          }
        ]
      },
      {
        category: {
          name: 'Sides & Appetizers',
          slug: 'sides-appetizers',
          description: 'Variety of side orders, starters, and soups to complement your meal',
          sortOrder: ++maxCategorySortOrder
        },
        items: [
          {
            name: 'Fried Raviolis',
            description: 'Golden fried cheese raviolis served with marinara sauce',
            basePrice: 900, // $9.00
            preparationTime: 8,
            sortOrder: 1
          },
          {
            name: 'Fried Mushrooms',
            description: 'Beer-battered fried mushrooms served with ranch dipping sauce',
            basePrice: 900, // $9.00
            preparationTime: 8,
            sortOrder: 2
          },
          {
            name: 'Mozzarella Sticks',
            description: 'Breaded mozzarella sticks served with marinara sauce',
            basePrice: 900, // $9.00
            preparationTime: 8,
            sortOrder: 3
          },
          {
            name: 'Spinach Egg Roll',
            description: 'Crispy egg roll filled with seasoned spinach and cheese',
            basePrice: 450, // $4.50
            preparationTime: 6,
            sortOrder: 4
          },
          {
            name: 'Pizza Egg Roll',
            description: 'Crispy egg roll filled with pizza sauce, cheese, and pepperoni',
            basePrice: 450, // $4.50
            preparationTime: 6,
            sortOrder: 5
          },
          {
            name: 'Small French Fries',
            description: 'Crispy golden french fries - small portion',
            basePrice: 600, // $6.00
            preparationTime: 5,
            sortOrder: 6
          },
          {
            name: 'Large French Fries',
            description: 'Crispy golden french fries - large portion',
            basePrice: 700, // $7.00
            preparationTime: 5,
            sortOrder: 7
          },
          {
            name: 'Small Onion Rings',
            description: 'Beer-battered onion rings - small portion',
            basePrice: 600, // $6.00
            preparationTime: 6,
            sortOrder: 8
          },
          {
            name: 'Large Onion Rings',
            description: 'Beer-battered onion rings - large portion',
            basePrice: 700, // $7.00
            preparationTime: 6,
            sortOrder: 9
          },
          {
            name: 'Small Pasta Salad',
            description: 'Fresh pasta salad with vegetables and Italian dressing - small portion',
            basePrice: 500, // $5.00
            preparationTime: 3,
            sortOrder: 10
          },
          {
            name: 'Large Pasta Salad',
            description: 'Fresh pasta salad with vegetables and Italian dressing - large portion',
            basePrice: 900, // $9.00
            preparationTime: 3,
            sortOrder: 11
          },
          {
            name: 'Small Cole Slaw',
            description: 'Fresh creamy coleslaw - small portion',
            basePrice: 500, // $5.00
            preparationTime: 3,
            sortOrder: 12
          },
          {
            name: 'Large Cole Slaw',
            description: 'Fresh creamy coleslaw - large portion',
            basePrice: 900, // $9.00
            preparationTime: 3,
            sortOrder: 13
          },
          {
            name: 'Cup of Chili',
            description: 'Hearty homemade chili served hot',
            basePrice: 700, // $7.00
            preparationTime: 5,
            sortOrder: 14
          },
          {
            name: 'Chicken Noodle Soup',
            description: 'Classic chicken noodle soup made fresh daily',
            basePrice: 700, // $7.00
            preparationTime: 5,
            sortOrder: 15
          }
        ]
      }
    ];

    console.log('🔄 Creating categories and items...\n');

    for (const data of menuData) {
      // Check if category exists
      let category = await prisma.menuCategory.findFirst({
        where: {
          OR: [
            { slug: data.category.slug },
            { name: data.category.name }
          ]
        }
      });

      if (!category) {
        category = await prisma.menuCategory.create({
          data: {
            name: data.category.name,
            slug: data.category.slug,
            description: data.category.description,
            isActive: true,
            sortOrder: data.category.sortOrder
          }
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`📁 Found existing category: ${category.name}`);
      }

      // Add items to category
      let itemsCreated = 0;
      for (const itemData of data.items) {
        const existingItem = await prisma.menuItem.findFirst({
          where: {
            name: itemData.name,
            categoryId: category.id
          }
        });

        if (!existingItem) {
          await prisma.menuItem.create({
            data: {
              ...itemData,
              categoryId: category.id,
              isActive: true,
              isAvailable: true
            }
          });
          itemsCreated++;
        }
      }

      console.log(`   ➕ Added ${itemsCreated} new items to ${category.name}`);
    }

    // Final summary
    console.log('\n📊 Final Menu Summary:');
    const allCategories = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    allCategories.forEach(cat => {
      console.log(`📁 ${cat.name}: ${cat._count.menuItems} items`);
    });

    console.log('\n🎉 Greenland Famous Menu import completed successfully!');
    console.log('📍 All categories are now available in the menu system');

  } catch (error) {
    console.error('❌ Error importing menu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGreenlandFamousMenu();
