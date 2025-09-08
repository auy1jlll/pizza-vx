const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function exportMainData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Exporting main database data...');
    
    const data = {
      timestamp: new Date().toISOString(),
      exported_from: 'local_database',
    };
    
    // Export the tables that work
    data.menu_categories = await prisma.menuCategory.findMany({
      include: {
        subcategories: true,
        menuItems: true,
        _count: {
          select: {
            menuItems: true,
            subcategories: true
          }
        }
      }
    });
    console.log(`✅ Menu Categories: ${data.menu_categories.length}`);
    
    data.menu_items = await prisma.menuItem.findMany();
    console.log(`✅ Menu Items: ${data.menu_items.length}`);
    
    data.specialty_pizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: true
      }
    });
    console.log(`✅ Specialty Pizzas: ${data.specialty_pizzas.length}`);
    
    data.customization_groups = await prisma.customizationGroup.findMany({
      include: {
        options: true
      }
    });
    console.log(`✅ Customization Groups: ${data.customization_groups.length}`);
    
    data.order_items = await prisma.orderItem.findMany();
    console.log(`✅ Order Items: ${data.order_items.length}`);
    
    data.orders = await prisma.order.findMany({
      include: {
        orderItems: true
      }
    });
    console.log(`✅ Orders: ${data.orders.length}`);
    
    data.users = await prisma.user.findMany();
    console.log(`✅ Users: ${data.users.length}`);
    
    // Try to get settings from raw SQL since the model might have a different name
    try {
      const settingsRaw = await prisma.$queryRaw`SELECT * FROM settings ORDER BY key`;
      data.settings = settingsRaw;
      console.log(`✅ Settings (raw): ${data.settings.length}`);
    } catch (error) {
      console.log(`❌ Settings raw query error: ${error.message}`);
      data.settings = [];
    }
    
    const filename = `main_database_export_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Main database export successful!');
    console.log(`📁 File saved as: ${filename}`);
    
    return filename;
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportMainData()
  .then(filename => {
    console.log(`\n🎉 Export completed successfully: ${filename}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Export failed:', error);
    process.exit(1);
  });
