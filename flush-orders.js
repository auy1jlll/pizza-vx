const { PrismaClient } = require('@prisma/client');

async function flushAllOrders() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🗑️ Flushing all orders from database...');
    console.log('⚠️  WARNING: This will permanently delete all order data!');

    // Get current order count
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();
    const orderItemToppingCount = await prisma.orderItemTopping.count();

    console.log(`\n📊 Current data:`);
    console.log(`  - Orders: ${orderCount}`);
    console.log(`  - Order Items: ${orderItemCount}`);
    console.log(`  - Order Item Toppings: ${orderItemToppingCount}`);

    if (orderCount === 0) {
      console.log('✅ No orders found - database is already clean!');
      return;
    }

    console.log('\n🧹 Starting deletion process...');

    // Delete in correct order due to foreign key constraints
    
    // 1. Delete order item toppings first
    if (orderItemToppingCount > 0) {
      console.log('Deleting order item toppings...');
      const deletedToppings = await prisma.orderItemTopping.deleteMany({});
      console.log(`✅ Deleted ${deletedToppings.count} order item toppings`);
    }

    // 2. Delete order items
    if (orderItemCount > 0) {
      console.log('Deleting order items...');
      const deletedItems = await prisma.orderItem.deleteMany({});
      console.log(`✅ Deleted ${deletedItems.count} order items`);
    }

    // 3. Delete orders
    if (orderCount > 0) {
      console.log('Deleting orders...');
      const deletedOrders = await prisma.order.deleteMany({});
      console.log(`✅ Deleted ${deletedOrders.count} orders`);
    }

    console.log('\n🎉 Order flush completed successfully!');
    console.log('📊 All order data has been permanently removed from the database.');

    // Verify deletion
    const remainingOrders = await prisma.order.count();
    const remainingItems = await prisma.orderItem.count();
    const remainingToppings = await prisma.orderItemTopping.count();

    console.log('\n✅ Verification:');
    console.log(`  - Remaining Orders: ${remainingOrders}`);
    console.log(`  - Remaining Order Items: ${remainingItems}`);
    console.log(`  - Remaining Order Item Toppings: ${remainingToppings}`);

    if (remainingOrders === 0 && remainingItems === 0 && remainingToppings === 0) {
      console.log('🎯 Perfect! All order data successfully flushed.');
    } else {
      console.log('⚠️  Warning: Some data may still remain. Please check manually.');
    }

  } catch (error) {
    console.error('❌ Error during order flush:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('  - Check if the database is accessible');
    console.log('  - Ensure no other processes are using the database');
    console.log('  - Verify Prisma schema is up to date');
  } finally {
    await prisma.$disconnect();
  }
}

flushAllOrders();
