const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleOrders() {
  try {
    console.log('Creating sample orders for kitchen display...');

    // Get pizza components
    const sizes = await prisma.pizzaSize.findMany();
    const crusts = await prisma.pizzaCrust.findMany();
    const sauces = await prisma.pizzaSauce.findMany();
    const toppings = await prisma.pizzaTopping.findMany();

    if (sizes.length === 0 || crusts.length === 0 || sauces.length === 0) {
      console.log('No pizza components found. Please add sizes, crusts, and sauces first.');
      return;
    }

    // Create sample orders with different statuses
    const sampleOrders = [
      {
        orderNumber: 'PZ001',
        customerName: 'John Smith',
        customerPhone: '555-0123',
        customerEmail: 'john@example.com',
        status: 'PENDING',
        orderType: 'PICKUP',
        subtotal: 24.99,
        tax: 2.00,
        total: 26.99,
        notes: 'Extra crispy crust please',
        items: [
          {
            pizzaSizeId: sizes[1]?.id || sizes[0].id, // Large or first available
            pizzaCrustId: crusts[0].id,
            pizzaSauceId: sauces[0].id,
            quantity: 1,
            basePrice: 18.99,
            totalPrice: 24.99,
            notes: 'Well done',
            toppings: toppings.slice(0, 3).map(t => t.id) // First 3 toppings
          }
        ]
      },
      {
        orderNumber: 'PZ002',
        customerName: 'Sarah Johnson',
        customerPhone: '555-0456',
        customerEmail: 'sarah@example.com',
        status: 'CONFIRMED',
        orderType: 'DELIVERY',
        deliveryAddress: '123 Main St',
        deliveryCity: 'Pizza City',
        deliveryInstructions: 'Ring doorbell twice, leave at door',
        subtotal: 32.98,
        deliveryFee: 3.99,
        tax: 2.96,
        total: 39.93,
        items: [
          {
            pizzaSizeId: sizes[0].id,
            pizzaCrustId: crusts[1]?.id || crusts[0].id,
            pizzaSauceId: sauces[1]?.id || sauces[0].id,
            quantity: 2,
            basePrice: 14.99,
            totalPrice: 32.98,
            toppings: toppings.slice(1, 4).map(t => t.id) // Different toppings
          }
        ]
      },
      {
        orderNumber: 'PZ003',
        customerName: 'Mike Davis',
        customerPhone: '555-0789',
        status: 'PREPARING',
        orderType: 'PICKUP',
        subtotal: 19.99,
        tax: 1.60,
        total: 21.59,
        notes: 'Customer has nut allergy',
        items: [
          {
            pizzaSizeId: sizes[0].id,
            pizzaCrustId: crusts[2]?.id || crusts[0].id,
            pizzaSauceId: sauces[2]?.id || sauces[0].id,
            quantity: 1,
            basePrice: 16.99,
            totalPrice: 19.99,
            toppings: [toppings[0]?.id, toppings[2]?.id].filter(Boolean)
          }
        ]
      },
      {
        orderNumber: 'PZ004',
        customerName: 'Emily Chen',
        customerPhone: '555-0321',
        status: 'READY',
        orderType: 'PICKUP',
        subtotal: 27.98,
        tax: 2.24,
        total: 30.22,
        scheduledTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        items: [
          {
            pizzaSizeId: sizes[1]?.id || sizes[0].id,
            pizzaCrustId: crusts[0].id,
            pizzaSauceId: sauces[0].id,
            quantity: 1,
            basePrice: 18.99,
            totalPrice: 18.99,
            toppings: [toppings[1]?.id].filter(Boolean)
          },
          {
            pizzaSizeId: sizes[0].id,
            pizzaCrustId: crusts[1]?.id || crusts[0].id,
            pizzaSauceId: sauces[1]?.id || sauces[0].id,
            quantity: 1,
            basePrice: 8.99,
            totalPrice: 8.99,
            toppings: []
          }
        ]
      }
    ];

    for (const orderData of sampleOrders) {
      // Create the order
      const order = await prisma.order.create({
        data: {
          orderNumber: orderData.orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail,
          status: orderData.status,
          orderType: orderData.orderType,
          deliveryAddress: orderData.deliveryAddress,
          deliveryCity: orderData.deliveryCity,
          deliveryInstructions: orderData.deliveryInstructions,
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee || 0,
          tax: orderData.tax,
          total: orderData.total,
          notes: orderData.notes,
          scheduledTime: orderData.scheduledTime,
          createdAt: new Date(Date.now() - Math.random() * 30 * 60 * 1000) // Random time within last 30 minutes
        }
      });

      // Create order items
      for (const itemData of orderData.items) {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            pizzaSizeId: itemData.pizzaSizeId,
            pizzaCrustId: itemData.pizzaCrustId,
            pizzaSauceId: itemData.pizzaSauceId,
            quantity: itemData.quantity,
            basePrice: itemData.basePrice,
            totalPrice: itemData.totalPrice,
            notes: itemData.notes
          }
        });

        // Add toppings
        for (const toppingId of itemData.toppings) {
          await prisma.orderItemTopping.create({
            data: {
              orderItemId: orderItem.id,
              pizzaToppingId: toppingId
            }
          });
        }
      }

      console.log(`Created order ${orderData.orderNumber}`);
    }

    console.log('Sample orders created successfully!');
    console.log('Visit http://localhost:3006/kitchen to see the kitchen display');

  } catch (error) {
    console.error('Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleOrders();
