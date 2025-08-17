// Simple script to add Chicken Finger Platter using direct database queries
const { exec } = require('child_process');

console.log('🍗 Creating Chicken Finger Platter...\n');

// First let's check what's in the database and then add our item
const commands = [
  // 1. Check if dinner-plates category exists
  `psql -h localhost -p 5433 -U postgres -d resto_db -c "SELECT id, name, slug FROM categories WHERE slug = 'dinner-plates';"`,
  
  // 2. Create the menu item (assuming dinner-plates category ID is what we find)
  `psql -h localhost -p 5433 -U postgres -d resto_db -c "
    INSERT INTO menu_items (name, description, base_price, category_id, is_active, sort_order, preparation_time, created_at, updated_at) 
    VALUES (
      'Chicken Finger Platter',
      'Crispy chicken fingers served with your choice of sides, salad, and dipping sauces',
      14.99,
      (SELECT id FROM categories WHERE slug = 'dinner-plates'),
      true,
      1,
      15,
      NOW(),
      NOW()
    );"`,
];

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        resolve(null);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function createChickenFingerPlatter() {
  console.log('1️⃣ Checking dinner-plates category...');
  await runCommand(commands[0]);
  
  console.log('\n2️⃣ Creating Chicken Finger Platter menu item...');
  await runCommand(commands[1]);
  
  console.log('\n✅ Chicken Finger Platter should now be in the database!');
  console.log('🌐 Check it at: http://localhost:3005/menu/dinner-plates');
}

createChickenFingerPlatter();
