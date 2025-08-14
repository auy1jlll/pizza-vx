const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrderHistoryAPI() {
  try {
    console.log('=== TESTING ORDER HISTORY API ===\n');
    
    // Test the API endpoint manually
    const testEmail = 'auy1jll@gmail.com';
    console.log(`Testing with email: ${testEmail}\n`);
    
    // Fetch orders directly from database (simulating API call)
    const orders = await prisma.order.findMany({
      where: { 
        customerEmail: testEmail
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
        createdAt: 'desc'
      },
      take: 5
    });

    console.log(`Found ${orders.length} orders for ${testEmail}:\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.orderNumber}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: $${order.total.toFixed(2)}`);
      console.log(`   Items: ${order.orderItems.length}`);
      console.log(`   Date: ${order.createdAt.toLocaleDateString()}`);
      
      order.orderItems.forEach((item, itemIndex) => {
        console.log(`   Item ${itemIndex + 1}: ${item.pizzaSize.name} ${item.pizzaCrust.name} with ${item.pizzaSauce.name}`);
        if (item.toppings.length > 0) {
          const toppingNames = item.toppings.map(t => t.pizzaTopping.name).join(', ');
          console.log(`     Toppings: ${toppingNames}`);
        }
        console.log(`     Price: $${item.totalPrice.toFixed(2)}`);
      });
      console.log('');
    });

    // Test API URL format
    console.log('=== API TEST URLS ===');
    console.log(`Customer Orders: http://localhost:3002/api/customer/orders?email=${encodeURIComponent(testEmail)}`);
    console.log(`Order History Page: http://localhost:3002/order-history`);
    console.log('');

    // Test different emails
    const testEmails = ['auy1jll@gmail.com', 'john@example.com', 'nonexistent@test.com'];
    
    for (const email of testEmails) {
      const count = await prisma.order.count({
        where: { customerEmail: email }
      });
      console.log(`${email}: ${count} orders`);
    }

  } catch (error) {
    console.error('Error testing order history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderHistoryAPI();
