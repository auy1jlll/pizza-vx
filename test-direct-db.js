const { PrismaClient } = require('@prisma/client');

async function testDirectDB() {
  try {
    console.log('Testing direct database access...\n');
    
    const prisma = new PrismaClient();
    
    // Test the same query as the API
    const orders = await prisma.order.findMany({
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

    console.log(`Found ${orders.length} active orders`);
    
    if (orders.length > 0) {
      const firstOrder = orders[0];
      console.log('\nFirst order details:');
      console.log(`ID: ${firstOrder.id}`);
      console.log(`Order Number: ${firstOrder.orderNumber}`);
      console.log(`Customer: ${firstOrder.customerName}`);
      console.log(`Status: ${firstOrder.status}`);
      console.log(`Items: ${firstOrder.orderItems.length}`);
      
      if (firstOrder.orderItems.length > 0) {
        const firstItem = firstOrder.orderItems[0];
        console.log('\nFirst item structure:');
        console.log('Raw item keys:', Object.keys(firstItem));
        console.log('pizzaSize:', firstItem.pizzaSize);
        console.log('pizzaCrust:', firstItem.pizzaCrust);
        console.log('pizzaSauce:', firstItem.pizzaSauce);
        console.log('toppings length:', firstItem.toppings.length);
      }
    }
    
    // Transform the data like the API does
    const transformedOrders = orders.map(order => ({
      ...order,
      status: order.status.toLowerCase(),
      items: order.orderItems.map(item => ({
        ...item,
        toppings: item.toppings
      }))
    }));
    
    console.log('\nTransformation successful');
    console.log('Sample transformed order status:', transformedOrders[0]?.status);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('Database error:', error);
  }
}

testDirectDB();
