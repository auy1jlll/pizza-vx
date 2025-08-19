const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugKitchenOrders() {
  try {
    console.log('=== DEBUGGING KITCHEN ORDERS ===\n');

    // Check if there are any orders
    const totalOrders = await prisma.order.count();
    console.log(`Total orders in database: ${totalOrders}`);

    // Get recent orders with full details
    const orders = await prisma.order.findMany({
      take: 3,
      include: {
        orderItems: {
          include: {
            pizzaSize: true,
            pizzaCrust: true,
            pizzaSauce: true,
            toppings: {
              include: {
                pizzaTopping: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\nFound ${orders.length} recent orders:\n`);

    orders.forEach((order, index) => {
      console.log(`--- ORDER ${index + 1} ---`);
      console.log(`ID: ${order.id}`);
      console.log(`Order Number: ${order.orderNumber}`);
      console.log(`Customer: ${order.customerName}`);
      console.log(`Status: ${order.status}`);
      console.log(`Total: $${order.total}`);
      console.log(`Created: ${order.createdAt}`);
      console.log(`Order Items: ${order.orderItems.length}`);

      order.orderItems.forEach((item, itemIndex) => {
        console.log(`\n  ITEM ${itemIndex + 1}:`);
        console.log(`  - Quantity: ${item.quantity}`);
        console.log(`  - Total Price: $${item.totalPrice}`);
        console.log(`  - Pizza Size: ${item.pizzaSize ? item.pizzaSize.name : 'NULL'} (ID: ${item.pizzaSizeId})`);
        console.log(`  - Pizza Crust: ${item.pizzaCrust ? item.pizzaCrust.name : 'NULL'} (ID: ${item.pizzaCrustId})`);
        console.log(`  - Pizza Sauce: ${item.pizzaSauce ? item.pizzaSauce.name : 'NULL'} (ID: ${item.pizzaSauceId})`);
        console.log(`  - Notes: ${item.notes || 'None'}`);
        console.log(`  - Toppings: ${item.toppings.length}`);
        
        item.toppings.forEach((topping, toppingIndex) => {
          console.log(`    TOPPING ${toppingIndex + 1}:`);
          console.log(`    - Name: ${topping.pizzaTopping ? topping.pizzaTopping.name : 'NULL'} (ID: ${topping.pizzaToppingId})`);
          console.log(`    - Quantity: ${topping.quantity}`);
          console.log(`    - Section: ${topping.section}`);
          console.log(`    - Intensity: ${topping.intensity}`);
        });
      });
      console.log('\n' + '='.repeat(50) + '\n');
    });

    // Check kitchen orders specifically
    const kitchenOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
        }
      },
      include: {
        orderItems: {
          include: {
            pizzaSize: true,
            pizzaCrust: true,
            pizzaSauce: true,
            toppings: {
              include: {
                pizzaTopping: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`\nKITCHEN ORDERS (active statuses): ${kitchenOrders.length}`);
    kitchenOrders.forEach(order => {
      console.log(`- Order ${order.orderNumber}: ${order.status} (${order.orderItems.length} items)`);
    });

    // Check if there are issues with the related data
    console.log('\n=== CHECKING RELATED DATA ===');
    
    const sizesCount = await prisma.pizzaSize.count();
    const crustsCount = await prisma.pizzaCrust.count();
    const saucesCount = await prisma.pizzaSauce.count();
    const toppingsCount = await prisma.pizzaTopping.count();
    
    console.log(`Pizza Sizes: ${sizesCount}`);
    console.log(`Pizza Crusts: ${crustsCount}`);
    console.log(`Pizza Sauces: ${saucesCount}`);
    console.log(`Pizza Toppings: ${toppingsCount}`);

    // Check for orphaned references
    const itemsWithMissingSize = await prisma.orderItem.count({
      where: {
        pizzaSize: null
      }
    });
    
    const itemsWithMissingCrust = await prisma.orderItem.count({
      where: {
        pizzaCrust: null
      }
    });
    
    const itemsWithMissingSauce = await prisma.orderItem.count({
      where: {
        pizzaSauce: null
      }
    });

    console.log(`\nOrphaned References:`);
    console.log(`Items with missing size: ${itemsWithMissingSize}`);
    console.log(`Items with missing crust: ${itemsWithMissingCrust}`);
    console.log(`Items with missing sauce: ${itemsWithMissingSauce}`);

  } catch (error) {
    console.error('Error debugging kitchen orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugKitchenOrders();
