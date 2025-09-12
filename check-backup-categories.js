const fs = require('fs');

async function checkBackupCategories() {
  try {
    console.log('🔍 Checking Backup Data for Pizza Categories...');
    console.log('===============================================');
    
    const backupFile = 'pizzax-export-2025-09-11T22-37-38-543Z.json';
    
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
    
    // Check category-topping relationships
    const categoryToppings = backup.categoryToppings || [];
    console.log(`\n🔗 Category-Topping Relationships: ${categoryToppings.length}`);
    
    if (categoryToppings.length > 0) {
      console.log('\nSample Category-Topping Mappings:');
      categoryToppings.slice(0, 10).forEach(ct => {
        console.log(`- Category ID: ${ct.categoryId} -> Topping ID: ${ct.toppingId}`);
      });
    }
    
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
    
    // Check menu items by category
    const menuItems = backup.menuItems || [];
    console.log(`\n🍽️ Total Menu Items: ${menuItems.length}`);
    
    const pizzaItems = menuItems.filter(item => 
      item.categoryId && pizzaCategories.some(cat => cat.id === item.categoryId)
    );
    
    console.log(`🍕 Pizza Menu Items: ${pizzaItems.length}`);
    
    // Show sample menu items
    if (pizzaItems.length > 0) {
      console.log('\nSample Pizza Menu Items:');
      pizzaItems.slice(0, 5).forEach(item => {
        console.log(`- ${item.name}: $${item.basePrice}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBackupCategories();
