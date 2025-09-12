const fs = require('fs');

async function checkBackupPizzaCategories() {
  try {
    console.log('🔍 Checking Backup Data for Pizza Categories...');
    console.log('===============================================');
    
    const backupFile = 'local_database_export_2025-08-29T06-55-48-977Z.json';
    
    if (!fs.existsSync(backupFile)) {
      console.log('❌ Backup file not found:', backupFile);
      return;
    }
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log(`📅 Backup from: ${backup.timestamp || 'Unknown'}`);
    
    // Check menu categories
    const categories = backup.menuCategories || [];
    console.log(`\n📋 Total Categories in Backup: ${categories.length}`);
    
    // Find pizza-related categories
    const pizzaCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('pizza') || 
      cat.name.toLowerCase().includes('calzone')
    );
    
    console.log(`\n🍕 Pizza-Related Categories: ${pizzaCategories.length}`);
    pizzaCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id})`);
      console.log(`  Description: ${cat.description || 'No description'}`);
      console.log(`  Sort Order: ${cat.sortOrder}`);
      console.log(`  Active: ${cat.isActive}`);
    });
    
    // Check all categories to see what we have
    console.log(`\n📋 All Categories in Backup:`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Sort: ${cat.sortOrder})`);
    });
    
    // Check category-topping relationships
    const categoryToppings = backup.categoryToppings || [];
    console.log(`\n🔗 Category-Topping Relationships: ${categoryToppings.length}`);
    
    if (categoryToppings.length > 0) {
      console.log('\nSample Category-Topping Mappings:');
      categoryToppings.slice(0, 10).forEach(ct => {
        console.log(`- Category ID: ${ct.categoryId} -> Topping ID: ${ct.toppingId}`);
      });
    }
    
    // Check menu items by category
    const menuItems = backup.menuItems || [];
    console.log(`\n🍽️ Total Menu Items: ${menuItems.length}`);
    
    // Check if we have the main pizza categories
    const expectedPizzaCategories = [
      'Pizza', 'Specialty Pizzas', 'Calzones', 'Specialty Calzones'
    ];
    
    console.log('\n🔍 Checking for Main Pizza Categories:');
    expectedPizzaCategories.forEach(expected => {
      const found = categories.find(cat => 
        cat.name.toLowerCase() === expected.toLowerCase()
      );
      console.log(`${found ? '✅' : '❌'} ${expected}: ${found ? found.name : 'NOT FOUND'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBackupPizzaCategories();
