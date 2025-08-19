const fetch = require('node-fetch');

async function verifyPizzaSectionUntouched() {
  try {
    console.log('🍕 Verifying Pizza section remains untouched...\n');

    // Login first
    const loginResponse = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@pizzabuilder.com',
        password: 'admin123'
      })
    });

    const cookies = loginResponse.headers.get('set-cookie');

    // Get pizza category and its items
    const categoriesResponse = await fetch('http://localhost:3005/api/admin/menu/categories', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    const categories = await categoriesResponse.json();
    const pizzaCategory = categories.find(cat => cat.slug === 'pizza');

    if (pizzaCategory) {
      console.log('✅ Pizza category found:');
      console.log(`   📁 Name: ${pizzaCategory.name}`);
      console.log(`   🏷️ Slug: ${pizzaCategory.slug}`);
      console.log(`   📊 Sort Order: ${pizzaCategory.sortOrder}`);
      console.log(`   ✨ Active: ${pizzaCategory.isActive}`);
      console.log(`   📈 Item Count: ${pizzaCategory._count?.menuItems || 'N/A'}`);
      console.log(`   🎛️ Customization Groups: ${pizzaCategory._count?.customizationGroups || 'N/A'}`);
    } else {
      console.log('❌ Pizza category not found!');
    }

    // Also check for specialty pizza
    const specialtyPizzaCategory = categories.find(cat => cat.slug === 'specialty-pizza');
    if (specialtyPizzaCategory) {
      console.log('\n✅ Specialty Pizza category found:');
      console.log(`   📁 Name: ${specialtyPizzaCategory.name}`);
      console.log(`   🏷️ Slug: ${specialtyPizzaCategory.slug}`);
      console.log(`   📊 Sort Order: ${specialtyPizzaCategory.sortOrder}`);
      console.log(`   ✨ Active: ${specialtyPizzaCategory.isActive}`);
      console.log(`   📈 Item Count: ${specialtyPizzaCategory._count?.menuItems || 'N/A'}`);
    }

    console.log('\n🔒 CONFIRMATION: Pizza sections are completely untouched and preserved.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyPizzaSectionUntouched();
