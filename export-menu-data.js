const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function exportMenuData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📦 Exporting menu data...');
    
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true,
        subcategories: {
          include: {
            menuItems: true
          }
        }
      }
    });
    
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: true
      }
    });
    
    const menuItems = await prisma.menuItem.findMany();
    
    const exportData = {
      categories,
      specialtyPizzas, 
      menuItems,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('menu-data-export.json', JSON.stringify(exportData, null, 2));
    
    console.log('✅ Export complete!');
    console.log(`📊 Categories: ${categories.length}`);
    console.log(`📊 Specialty Pizzas: ${specialtyPizzas.length}`);
    console.log(`📊 Menu Items: ${menuItems.length}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportMenuData();
