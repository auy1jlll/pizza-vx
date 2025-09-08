const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importMenuData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📥 Importing menu data...');
    
    // Read the exported data
    const exportData = JSON.parse(fs.readFileSync('menu-data-export.json', 'utf8'));
    
    console.log('🔍 Found data:');
    console.log('  Categories:', exportData.categories.length);
    console.log('  Specialty Pizzas:', exportData.specialtyPizzas.length);
    console.log('  Menu Items:', exportData.menuItems.length);
    
    // Import categories first (they are parents)
    for (const category of exportData.categories) {
      const { menuItems, subcategories, ...categoryData } = category;
      
      await prisma.menuCategory.upsert({
        where: { id: category.id },
        update: categoryData,
        create: categoryData
      });
    }
    console.log('✅ Categories imported');
    
    // Import menu items
    for (const item of exportData.menuItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
    }
    console.log('✅ Menu items imported');
    
    // Import specialty pizzas
    for (const pizza of exportData.specialtyPizzas) {
      const { sizes, ...pizzaData } = pizza;
      
      await prisma.specialtyPizza.upsert({
        where: { id: pizza.id },
        update: pizzaData,
        create: pizzaData
      });
    }
    console.log('✅ Specialty pizzas imported');
    
    // Verify import
    const categoryCount = await prisma.menuCategory.count();
    const itemCount = await prisma.menuItem.count();
    const pizzaCount = await prisma.specialtyPizza.count();
    
    console.log('📊 Import verification:');
    console.log('  Categories:', categoryCount);
    console.log('  Menu Items:', itemCount);
    console.log('  Specialty Pizzas:', pizzaCount);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importMenuData();
