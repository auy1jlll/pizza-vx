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
    
    // First, import parent categories (those without parentCategoryId)
    const parentCategories = exportData.categories.filter(cat => !cat.parentCategoryId);
    const childCategories = exportData.categories.filter(cat => cat.parentCategoryId);
    
    console.log('📁 Importing parent categories first...');
    for (const category of parentCategories) {
      const { menuItems, subcategories, ...categoryData } = category;
      
      await prisma.menuCategory.upsert({
        where: { id: category.id },
        update: categoryData,
        create: categoryData
      });
    }
    console.log('✅ Parent categories imported:', parentCategories.length);
    
    console.log('📁 Importing child categories...');
    for (const category of childCategories) {
      const { menuItems, subcategories, ...categoryData } = category;
      
      await prisma.menuCategory.upsert({
        where: { id: category.id },
        update: categoryData,
        create: categoryData
      });
    }
    console.log('✅ Child categories imported:', childCategories.length);
    
    // Import menu items
    console.log('🍕 Importing menu items...');
    for (const item of exportData.menuItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
    }
    console.log('✅ Menu items imported');
    
    // Import specialty pizzas
    console.log('🍕 Importing specialty pizzas...');
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
    
    console.log('🎉 Menu data import complete!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

importMenuData();
