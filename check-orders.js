const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    console.log('=== CHECKING ORDERS ===');
    
    const orders = await prisma.order.findMany({
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

    console.log(`\nFound ${orders.length} orders:\n`);

    orders.forEach(order => {
      console.log(`Order #${order.orderNumber}`);
      console.log(`  Customer: ${order.customerName || 'Unknown'}`);
      console.log(`  Email: ${order.customerEmail || 'No email'}`);
      console.log(`  Phone: ${order.customerPhone || 'No phone'}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Type: ${order.orderType}`);
      console.log(`  Total: $${order.total.toFixed(2)}`);
      console.log(`  Items: ${order.orderItems.length}`);
      console.log(`  Created: ${order.createdAt.toLocaleString()}`);
      console.log('  ---');
    });

  } catch (error) {
    console.error('Error checking orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
