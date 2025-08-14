const { PrismaClient } = require('@prisma/client');

async function thoroughFlush() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Performing thorough database flush check...');

    // Check all order-related tables
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();
    const orderItemToppingCount = await prisma.orderItemTopping.count();

    console.log(`\n📊 Current order data:`);
    console.log(`  - Orders: ${orderCount}`);
    console.log(`  - Order Items: ${orderItemCount}`);
    console.log(`  - Order Item Toppings: ${orderItemToppingCount}`);

    // Check other data that might be related
    const userCount = await prisma.user.count();
    const sizeCount = await prisma.pizzaSize.count();
    const crustCount = await prisma.pizzaCrust.count();
    const sauceCount = await prisma.pizzaSauce.count();
    const toppingCount = await prisma.pizzaTopping.count();
    const specialtyPizzaCount = await prisma.specialtyPizza.count();
    const specialtyPizzaSizeCount = await prisma.specialtyPizzaSize.count();

    console.log(`\n📊 Other database content:`);
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Pizza Sizes: ${sizeCount}`);
    console.log(`  - Pizza Crusts: ${crustCount}`);
    console.log(`  - Pizza Sauces: ${sauceCount}`);
    console.log(`  - Pizza Toppings: ${toppingCount}`);
    console.log(`  - Specialty Pizzas: ${specialtyPizzaCount}`);
    console.log(`  - Specialty Pizza Sizes: ${specialtyPizzaSizeCount}`);

    const totalOrderData = orderCount + orderItemCount + orderItemToppingCount;

    if (totalOrderData === 0) {
      console.log('\n✅ PERFECT! All order data has been successfully flushed.');
      console.log('🧹 Database is completely clean of order information.');
    } else {
      console.log('\n🚨 FORCE FLUSH REQUIRED!');
      console.log('Performing force deletion...');

      // Force delete everything in correct order
      if (orderItemToppingCount > 0) {
        const deletedToppings = await prisma.orderItemTopping.deleteMany({});
        console.log(`✅ Force deleted ${deletedToppings.count} order item toppings`);
      }

      if (orderItemCount > 0) {
        const deletedItems = await prisma.orderItem.deleteMany({});
        console.log(`✅ Force deleted ${deletedItems.count} order items`);
      }

      if (orderCount > 0) {
        const deletedOrders = await prisma.order.deleteMany({});
        console.log(`✅ Force deleted ${deletedOrders.count} orders`);
      }

      console.log('\n🎉 FORCE FLUSH COMPLETED!');
    }

    // Final verification
    const finalOrderCount = await prisma.order.count();
    const finalOrderItemCount = await prisma.orderItem.count();
    const finalOrderItemToppingCount = await prisma.orderItemTopping.count();

    console.log('\n🔍 Final verification:');
    console.log(`  - Orders: ${finalOrderCount}`);
    console.log(`  - Order Items: ${finalOrderItemCount}`);
    console.log(`  - Order Item Toppings: ${finalOrderItemToppingCount}`);

    if (finalOrderCount === 0 && finalOrderItemCount === 0 && finalOrderItemToppingCount === 0) {
      console.log('\n🎯 SUCCESS! Database is now completely clean of all order data.');
      console.log('💡 You can now start fresh with new orders.');
    } else {
      console.log('\n⚠️  Warning: Some order data may still remain. Manual intervention may be required.');
    }

  } catch (error) {
    console.error('❌ Error during thorough flush:', error);
  } finally {
    await prisma.$disconnect();
  }
}

thoroughFlush();
