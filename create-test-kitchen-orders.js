const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestOrders() {
  try {
    console.log('🧪 Creating test orders with different statuses...\n');

    // Get required components
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany(),
      prisma.pizzaCrust.findMany(),
      prisma.pizzaSauce.findMany(),
      prisma.pizzaTopping.findMany({ take: 3 })
    ]);

    if (sizes.length === 0 || crusts.length === 0 || sauces.length === 0) {
      console.log('❌ Missing required pizza components');
      return;
    }

    // Create orders with different statuses
    const testOrders = [
      {
        orderNumber: `KT-PENDING-${Date.now()}`,
        customerName: 'John Doe',
        customerEmail: 'john@test.com',
        customerPhone: '555-0001',
        status: 'PENDING',
        orderType: 'PICKUP',
        paymentMethod: 'CREDIT_CARD',
        subtotal: 18.99,
        deliveryFee: 0,
        tipAmount: 3.04,
        tipPercentage: 18,
        tax: 1.52,
        total: 23.55,
        notes: 'Extra crispy please'
      },
      {
        orderNumber: `KT-CONFIRMED-${Date.now() + 1}`,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@test.com',
        customerPhone: '555-0002',
        status: 'CONFIRMED',
        orderType: 'DELIVERY',
        paymentMethod: 'PAY_ON_DELIVERY',
        deliveryAddress: '123 Main St',
        deliveryCity: 'Test City',
        deliveryZip: '12345',
        deliveryInstructions: 'Ring doorbell twice',
        subtotal: 24.99,
        deliveryFee: 3.99,
        tipAmount: 4.50,
        tipPercentage: 15,
        tax: 2.00,
        total: 35.48
      },
      {
        orderNumber: `KT-PREPARING-${Date.now() + 2}`,
        customerName: 'Mike Wilson',
        customerEmail: 'mike@test.com',
        customerPhone: '555-0003',
        status: 'PREPARING',
        orderType: 'PICKUP',
        paymentMethod: 'PAY_AT_PICKUP',
        subtotal: 21.99,
        deliveryFee: 0,
        tax: 1.76,
        total: 23.75,
        notes: 'No onions please'
      },
      {
        orderNumber: `KT-READY-${Date.now() + 3}`,
        customerName: 'Lisa Brown',
        customerEmail: 'lisa@test.com',
        customerPhone: '555-0004',
        status: 'READY',
        orderType: 'PICKUP',
        paymentMethod: 'CREDIT_CARD',
        subtotal: 16.99,
        deliveryFee: 0,
        tipAmount: 2.55,
        tipPercentage: 20,
        tax: 1.36,
        total: 20.90
      }
    ];

    console.log('Creating orders...\n');

    for (let i = 0; i < testOrders.length; i++) {
      const orderData = testOrders[i];
      
      // Create the order
      const order = await prisma.order.create({
        data: orderData
      });

      // Create a sample order item for each order
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          pizzaSizeId: sizes[i % sizes.length].id,
          pizzaCrustId: crusts[i % crusts.length].id,
          pizzaSauceId: sauces[i % sauces.length].id,
          quantity: 1,
          basePrice: 15.99,
          totalPrice: orderData.subtotal,
          notes: `${sizes[i % sizes.length].name} pizza with ${crusts[i % crusts.length].name} crust`
        }
      });

      // Add some toppings
      if (toppings.length > 0) {
        const toppingsToAdd = toppings.slice(0, (i % 3) + 1); // Add 1-3 toppings
        for (const topping of toppingsToAdd) {
          await prisma.orderItemTopping.create({
            data: {
              orderItemId: orderItem.id,
              pizzaToppingId: topping.id,
              quantity: 1,
              section: 'WHOLE',
              intensity: 'REGULAR',
              price: topping.price
            }
          });
        }
      }

      console.log(`✅ Created ${orderData.status} order: ${orderData.orderNumber}`);
    }

    console.log('\n🎉 Test orders created successfully!');
    console.log('\n📋 Summary:');
    console.log('   • PENDING order - will show in kitchen screen');
    console.log('   • CONFIRMED order - will show in kitchen screen');  
    console.log('   • PREPARING order - will show in kitchen screen');
    console.log('   • READY order - will show in kitchen screen');
    console.log('\n🔗 Visit these pages to see the orders:');
    console.log('   • Admin Orders: http://localhost:3001/admin/orders');
    console.log('   • Kitchen Screen: http://localhost:3001/admin/kitchen');

  } catch (error) {
    console.error('❌ Error creating test orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders();
