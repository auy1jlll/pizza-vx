const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function exportDatabaseSafely() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting database export...');
    
    const data = {
      timestamp: new Date().toISOString(),
      exported_from: 'local_database',
    };
    
    // Export tables one by one with error handling
    try {
      data.settings = await prisma.setting.findMany();
      console.log(`✅ Settings: ${data.settings.length}`);
    } catch (error) {
      console.log(`❌ Settings table error: ${error.message}`);
      data.settings = [];
    }
    
    try {
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
    } catch (error) {
      console.log(`❌ Menu Categories error: ${error.message}`);
      data.menu_categories = [];
    }
    
    try {
      data.menu_items = await prisma.menuItem.findMany({
        include: {
          prices: true,
          customizationGroups: {
            include: {
              customizations: true
            }
          }
        }
      });
      console.log(`✅ Menu Items: ${data.menu_items.length}`);
    } catch (error) {
      console.log(`❌ Menu Items error: ${error.message}`);
      data.menu_items = [];
    }
    
    try {
      data.specialty_pizzas = await prisma.specialtyPizza.findMany({
        include: {
          prices: true,
          toppings: true
        }
      });
      console.log(`✅ Specialty Pizzas: ${data.specialty_pizzas.length}`);
    } catch (error) {
      console.log(`❌ Specialty Pizzas error: ${error.message}`);
      data.specialty_pizzas = [];
    }
    
    try {
      data.sizes = await prisma.size.findMany();
      console.log(`✅ Sizes: ${data.sizes.length}`);
    } catch (error) {
      console.log(`❌ Sizes error: ${error.message}`);
      data.sizes = [];
    }
    
    try {
      data.crusts = await prisma.crust.findMany();
      console.log(`✅ Crusts: ${data.crusts.length}`);
    } catch (error) {
      console.log(`❌ Crusts error: ${error.message}`);
      data.crusts = [];
    }
    
    try {
      data.toppings = await prisma.topping.findMany();
      console.log(`✅ Toppings: ${data.toppings.length}`);
    } catch (error) {
      console.log(`❌ Toppings error: ${error.message}`);
      data.toppings = [];
    }
    
    try {
      data.customization_groups = await prisma.customizationGroup.findMany({
        include: {
          customizations: true
        }
      });
      console.log(`✅ Customization Groups: ${data.customization_groups.length}`);
    } catch (error) {
      console.log(`❌ Customization Groups error: ${error.message}`);
      data.customization_groups = [];
    }
    
    try {
      data.customizations = await prisma.customization.findMany();
      console.log(`✅ Customizations: ${data.customizations.length}`);
    } catch (error) {
      console.log(`❌ Customizations error: ${error.message}`);
      data.customizations = [];
    }
    
    try {
      data.prices = await prisma.price.findMany();
      console.log(`✅ Prices: ${data.prices.length}`);
    } catch (error) {
      console.log(`❌ Prices error: ${error.message}`);
      data.prices = [];
    }
    
    try {
      data.orders = await prisma.order.findMany({
        include: {
          items: true
        }
      });
      console.log(`✅ Orders: ${data.orders.length}`);
    } catch (error) {
      console.log(`❌ Orders error: ${error.message}`);
      data.orders = [];
    }
    
    try {
      data.order_items = await prisma.orderItem.findMany();
      console.log(`✅ Order Items: ${data.order_items.length}`);
    } catch (error) {
      console.log(`❌ Order Items error: ${error.message}`);
      data.order_items = [];
    }
    
    try {
      data.customers = await prisma.customer.findMany();
      console.log(`✅ Customers: ${data.customers.length}`);
    } catch (error) {
      console.log(`❌ Customers error: ${error.message}`);
      data.customers = [];
    }
    
    try {
      data.users = await prisma.user.findMany();
      console.log(`✅ Users: ${data.users.length}`);
    } catch (error) {
      console.log(`❌ Users error: ${error.message}`);
      data.users = [];
    }
    
    const filename = `complete_database_export_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Complete database export successful!');
    console.log(`📁 File saved as: ${filename}`);
    
    return filename;
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabaseSafely()
  .then(filename => {
    console.log(`\n🎉 Export completed successfully: ${filename}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Export failed:', error);
    process.exit(1);
  });
