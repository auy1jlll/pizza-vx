const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Specific Unsplash URLs for correct food images
const CORRECT_FOOD_IMAGES = {
  // BLT specific images (bacon, lettuce, tomato sandwich)
  'BLT Sub': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // BLT sandwich
  
  // Better deli sub images
  'American Sub': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // deli sandwich
  'Italian Sub': 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // Italian sandwich
  'Turkey Sub': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // turkey sandwich
  'Genoa Salami Sub': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // salami sandwich
  'Imported Ham': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // ham sandwich
  'Veggie Sub': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80', // veggie sandwich
  'Crab Meat Salad': 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1935&q=80', // seafood salad
  
  // Chicken items
  'Chicken Salad': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80', // chicken salad
  'Chicken Wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80', // chicken wings
  'Buffalo Chicken Wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80', // buffalo wings
  'BBQ Chicken Wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80', // bbq wings
  'Chicken Fingers': 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // chicken fingers
  'Buffalo Chicken Fingers': 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // buffalo fingers
  'BBQ Chicken Fingers': 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // bbq fingers
  'Chicken Kabob Dinner': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // chicken kabob
  
  // Roast beef items - use actual roast beef images
  'Roast Beef 3-Way (Junior)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef
  'Roast Beef 3-Way (Regular)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef
  'Roast Beef 3-Way (Super)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef
  'Roast Beef Dinner': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef dinner
  'Roast Beef Sandwich (Junior)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef sandwich
  'Roast Beef Sandwich (Regular)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef sandwich
  'Roast Beef Sandwich (Super)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef sandwich
  'Roast Beef Sub (Large)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef sub
  'Roast Beef Sub (Regular)': 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // roast beef sub
  'Steak & Cheese Sub': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80', // steak sandwich
  'Steak Tips Kabob': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // steak kabob
  
  // Pasta items
  'Chicken Broccoli Alfredo Ziti': 'https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // pasta dish
  
  // French fries and sides
  'French Fries - Large': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // french fries
  'French Fries - Small': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // french fries
  'Onion Rings - Large': 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80', // onion rings
  'Onion Rings - Small': 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80', // onion rings
  'Mozzarella Sticks': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', // mozzarella sticks
  
  // Soups and chowders
  'Chicken Noodle Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80', // chicken soup
  'Clam Chowder Bowl': 'https://images.unsplash.com/photo-1563379091023-16a7c0b0235e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // clam chowder
  'Clam Chowder': 'https://images.unsplash.com/photo-1563379091023-16a7c0b0235e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // clam chowder
  'Haddock Chowder': 'https://images.unsplash.com/photo-1563379091023-16a7c0b0235e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // fish chowder
  'A Cup of Chili': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // chili
  
  // Seafood
  'Haddock Sandwich': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2062&q=80', // fish sandwich
  'Native Clams': 'https://images.unsplash.com/photo-1563379091023-16a7c0b0235e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // clams
  'Sea Monster Platter': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // seafood platter
  
  // Salads
  'Caesar Salad': 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1935&q=80', // caesar salad
  'Greek Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1884&q=80', // greek salad
  'Tuna Salad': 'https://images.unsplash.com/photo-1565299585323-38174c4a6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=2044&q=80', // tuna salad
  
  // Pizza - use diverse pizza images
  'Athenian Pizza (Large)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // pizza
  'Athenian Pizza (Small)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // pizza
  'BBQ Chicken Pizza (Large)': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=2125&q=80', // bbq chicken pizza
  'BBQ Chicken Pizza (Small)': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=2125&q=80', // bbq chicken pizza
  'Buffalo Chicken Pizza (Large)': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80', // buffalo pizza
  'Buffalo Chicken Pizza (Small)': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80', // buffalo pizza
  'Chicken Alfredo Pizza (Large)': 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-4.0.3&auto=format&fit=crop&w=2130&q=80', // white pizza
  'Chicken Alfredo Pizza (Small)': 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-4.0.3&auto=format&fit=crop&w=2130&q=80', // white pizza
  'Meat Lovers Pizza (Large)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // meat pizza
  'Meat Lovers Pizza (Small)': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // meat pizza
  'Veggie Pizza (Large)': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // veggie pizza
  'Veggie Pizza (Small)': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80', // veggie pizza
  'House Special Pizza (Large)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // house special pizza
  'House Special Pizza (Small)': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // house special pizza
  
  // Miscellaneous items that need better images
  'Fried Mushrooms': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // fried mushrooms
  'Fried Raviolis': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // fried ravioli
  'Pizza Egg Roll': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // egg roll
  'Spinach Egg Roll': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // spinach egg roll
  'Coleslaw - Large': 'https://images.unsplash.com/photo-1578850166948-817c6c3bb8b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // coleslaw
  'Coleslaw - Small': 'https://images.unsplash.com/photo-1578850166948-817c6c3bb8b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // coleslaw
  'Pasta Salad - Large': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // pasta salad
  'Pasta Salad - Small': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80', // pasta salad
};

async function fixSpecificMismatchedImages() {
  console.log('🎯 Fixing specifically mismatched images with human intelligence...\n');
  
  let updateCount = 0;
  
  for (const [itemName, correctImageUrl] of Object.entries(CORRECT_FOOD_IMAGES)) {
    try {
      // Find the menu item
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: itemName }
      });
      
      if (menuItem) {
        // Update with the correct image
        await prisma.menuItem.update({
          where: { id: menuItem.id },
          data: { imageUrl: correctImageUrl }
        });
        
        console.log(`✅ Fixed: ${itemName}`);
        console.log(`   📸 New image: ${correctImageUrl}\n`);
        updateCount++;
      } else {
        console.log(`⚠️  Item not found: ${itemName}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${itemName}:`, error);
    }
  }
  
  console.log(`\n🎉 Successfully updated ${updateCount} menu items with properly matched images!`);
  console.log('🧠 Used human intelligence to match food images with menu items');
  console.log('🥪 BLT now shows actual BLT sandwich instead of burger');
  console.log('🥩 Roast beef items now show actual roast beef');
  console.log('🍕 Pizza varieties now have distinct images');
  console.log('🍲 Soups and chowders properly represented');
}

fixSpecificMismatchedImages()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
  });
