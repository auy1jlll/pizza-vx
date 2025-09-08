const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://pizzauser:pizza123@localhost:5432/pizzadb'
    }
  }
});

async function exportCompleteDatabase() {
  try {
    console.log('🔄 Starting complete database export...');
    
    const data = {
      timestamp: new Date().toISOString(),
      exported_from: 'local_database',
      
      // Settings
      settings: await prisma.setting.findMany(),
      
      // Menu data
      menu_categories: await prisma.menuCategory.findMany({
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
      }),
      
      menu_items: await prisma.menuItem.findMany({
        include: {
          prices: true,
          customizationGroups: {
            include: {
              customizations: true
            }
          }
        }
      }),
      
      specialty_pizzas: await prisma.specialtyPizza.findMany({
        include: {
          prices: true,
          toppings: true
        }
      }),
      
      // Product configuration
      sizes: await prisma.size.findMany(),
      crusts: await prisma.crust.findMany(),
      toppings: await prisma.topping.findMany(),
      
      // Customizations
      customization_groups: await prisma.customizationGroup.findMany({
        include: {
          customizations: true
        }
      }),
      
      customizations: await prisma.customization.findMany(),
      
      // Other tables
      prices: await prisma.price.findMany(),
      order_items: await prisma.orderItem.findMany(),
      orders: await prisma.order.findMany({
        include: {
          items: true
        }
      }),
      
      // Users and roles
      users: await prisma.user.findMany(),
      roles: await prisma.role.findMany(),
      user_roles: await prisma.userRole.findMany(),
      
      // Email and notifications
      email_templates: await prisma.emailTemplate.findMany(),
      email_queue: await prisma.emailQueue.findMany(),
      notifications: await prisma.notification.findMany(),
      
      // Customer data
      customers: await prisma.customer.findMany(),
      customer_addresses: await prisma.customerAddress.findMany(),
      loyalty_points: await prisma.loyaltyPoint.findMany(),
      
      // Promotional
      coupons: await prisma.coupon.findMany(),
      coupon_usage: await prisma.couponUsage.findMany(),
      
      // Reviews and feedback
      reviews: await prisma.review.findMany(),
      
      // Analytics
      page_views: await prisma.pageView.findMany(),
      analytics_events: await prisma.analyticsEvent.findMany(),
      
      // Inventory
      inventory_items: await prisma.inventoryItem.findMany(),
      inventory_transactions: await prisma.inventoryTransaction.findMany(),
      
      // Staff and operations
      staff_schedules: await prisma.staffSchedule.findMany(),
      delivery_zones: await prisma.deliveryZone.findMany(),
      tax_rates: await prisma.taxRate.findMany(),
    };
    
    const filename = `complete_database_dump_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    console.log('✅ Complete database export successful!');
    console.log(`📁 File saved as: ${filename}`);
    
    // Print summary
    console.log('\n📊 Export Summary:');
    console.log(`- Settings: ${data.settings.length}`);
    console.log(`- Menu Categories: ${data.menu_categories.length}`);
    console.log(`- Menu Items: ${data.menu_items.length}`);
    console.log(`- Specialty Pizzas: ${data.specialty_pizzas.length}`);
    console.log(`- Sizes: ${data.sizes.length}`);
    console.log(`- Crusts: ${data.crusts.length}`);
    console.log(`- Toppings: ${data.toppings.length}`);
    console.log(`- Customization Groups: ${data.customization_groups.length}`);
    console.log(`- Customizations: ${data.customizations.length}`);
    console.log(`- Orders: ${data.orders.length}`);
    console.log(`- Customers: ${data.customers.length}`);
    console.log(`- Users: ${data.users.length}`);
    
    return filename;
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportCompleteDatabase()
  .then(filename => {
    console.log(`\n🎉 Export completed successfully: ${filename}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Export failed:', error);
    process.exit(1);
  });
