const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Intelligent image mapping based on actual menu item names and descriptions
const getIntelligentImage = (name, description, category) => {
  const nameLC = name.toLowerCase();
  const descLC = (description || '').toLowerCase();
  const categoryLC = category.toLowerCase();

  // DELI SUBS - Match actual sub types
  if (categoryLC.includes('deli') || categoryLC.includes('sub')) {
    if (nameLC.includes('italian')) {
      return 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'; // Italian sub
    }
    if (nameLC.includes('turkey')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80'; // Turkey sub
    }
    if (nameLC.includes('ham')) {
      return 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Ham sub
    }
    if (nameLC.includes('blt') || descLC.includes('bacon')) {
      return 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80'; // BLT sandwich
    }
    if (nameLC.includes('roast beef') || nameLC.includes('beef')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Roast beef sub
    }
    if (nameLC.includes('tuna')) {
      return 'https://images.unsplash.com/photo-1565299585323-38174c4a6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80'; // Tuna sub
    }
    if (nameLC.includes('chicken')) {
      return 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'; // Chicken sub
    }
    if (nameLC.includes('veggie') || nameLC.includes('vegetarian')) {
      return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2067&q=80'; // Veggie sub
    }
    if (nameLC.includes('steak') || nameLC.includes('cheese steak')) {
      return 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'; // Cheese steak
    }
    if (nameLC.includes('meatball')) {
      return 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80'; // Meatball sub
    }
    // Generic sub fallback
    return 'https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
  }

  // SEAFOOD - Match seafood items
  if (categoryLC.includes('seafood')) {
    if (nameLC.includes('sea monster') || nameLC.includes('platter')) {
      return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Seafood platter
    }
    if (nameLC.includes('fish') || nameLC.includes('haddock')) {
      return 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Fish and chips
    }
    if (nameLC.includes('shrimp') || nameLC.includes('scallop')) {
      return 'https://images.unsplash.com/photo-1565680018434-b513d5573b80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Shrimp/scallops
    }
    if (nameLC.includes('clam')) {
      return 'https://images.unsplash.com/photo-1563379091023-16a7c0b0235e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Clams
    }
    // Generic seafood
    return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  }

  // SALADS - Match salad types
  if (categoryLC.includes('salad')) {
    if (nameLC.includes('caesar')) {
      return 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Caesar salad
    }
    if (nameLC.includes('greek')) {
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=2084&q=80'; // Greek salad
    }
    if (nameLC.includes('chicken')) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Chicken salad
    }
    if (nameLC.includes('garden') || nameLC.includes('build your own')) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Garden salad
    }
    // Generic salad
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  }

  // ROAST BEEF - Match roast beef items
  if (categoryLC.includes('roast beef') || nameLC.includes('roast beef')) {
    if (nameLC.includes('3-way')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Roast beef sandwich
    }
    if (nameLC.includes('super')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80'; // Large roast beef
    }
    // Generic roast beef
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  }

  // DINNER PLATES - Match dinner items
  if (categoryLC.includes('dinner')) {
    if (nameLC.includes('chicken')) {
      return 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'; // Chicken dinner
    }
    if (nameLC.includes('steak')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Steak dinner
    }
    if (nameLC.includes('pasta')) {
      return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=2132&q=80'; // Pasta
    }
    // Generic dinner plate
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  }

  // SPECIALTY PIZZA - Match pizza types
  if (categoryLC.includes('pizza') || categoryLC.includes('specialty')) {
    if (nameLC.includes('chicken alfredo')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80'; // Chicken alfredo pizza
    }
    if (nameLC.includes('margherita')) {
      return 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Margherita pizza
    }
    if (nameLC.includes('meat') || nameLC.includes('pepperoni')) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Meat pizza
    }
    // Generic pizza
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  }

  // APPETIZERS/SIDES
  if (nameLC.includes('wings')) {
    return 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80'; // Wings
  }
  if (nameLC.includes('fries') || nameLC.includes('onion rings')) {
    return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'; // Fries
  }
  if (nameLC.includes('mozzarella stick')) {
    return 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Mozzarella sticks
  }

  // Fallback based on category
  if (categoryLC.includes('deli')) return 'https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
  if (categoryLC.includes('seafood')) return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  if (categoryLC.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  
  // Ultimate fallback
  return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
};

async function fixMenuImagesIntelligently() {
  console.log('🧠 Using human intelligence to match images with menu items...\n');

  try {
    // Get all menu items with their categories
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      }
    });

    console.log(`📋 Found ${menuItems.length} menu items to analyze\n`);

    let updatedCount = 0;

    for (const item of menuItems) {
      const categoryName = item.category?.name || 'Unknown';
      const intelligentImage = getIntelligentImage(item.name, item.description, categoryName);
      
      // Only update if the image is different
      if (item.imageUrl !== intelligentImage) {
        await prisma.menuItem.update({
          where: { id: item.id },
          data: { imageUrl: intelligentImage }
        });

        console.log(`✅ ${item.name} (${categoryName})`);
        console.log(`   📸 Updated with intelligent image match`);
        updatedCount++;
      } else {
        console.log(`⏭️  ${item.name} - Already has correct image`);
      }
    }

    // Update category images too
    console.log('\n🏷️  Updating category images...');
    
    const categories = await prisma.menuCategory.findMany();
    
    for (const category of categories) {
      let categoryImage;
      const catName = category.name.toLowerCase();
      
      if (catName.includes('deli') || catName.includes('sub')) {
        categoryImage = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
      } else if (catName.includes('seafood')) {
        categoryImage = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
      } else if (catName.includes('salad')) {
        categoryImage = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
      } else if (catName.includes('roast beef')) {
        categoryImage = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
      } else if (catName.includes('dinner')) {
        categoryImage = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80';
      } else if (catName.includes('pizza')) {
        categoryImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
      }
      
      if (categoryImage && category.imageUrl !== categoryImage) {
        await prisma.menuCategory.update({
          where: { id: category.id },
          data: { imageUrl: categoryImage }
        });
        console.log(`✅ Updated ${category.name} category image`);
      }
    }

    console.log(`\n🎉 INTELLIGENT IMAGE MATCHING COMPLETE!`);
    console.log(`📊 Updated ${updatedCount} menu items with proper matching images`);
    console.log(`🧠 Now all images should actually match their menu items!`);

  } catch (error) {
    console.error('❌ Error during intelligent image matching:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMenuImagesIntelligently();
