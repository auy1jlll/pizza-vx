import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    console.log('🔍 Checking orders in database...\n');
    
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (orders.length === 0) {
      console.log('❌ No orders found in database');
      
      // Create a test order for testing
      console.log('\n🔧 Creating a test order...');
      
      const testOrder = await prisma.order.create({
        data: {
          orderNumber: 'TEST-' + Date.now(),
          customerEmail: 'auy1jlll@gmail.com',
          customerName: 'Test Customer',
          status: 'CONFIRMED',
          orderType: 'PICKUP',
          subtotal: 15.99,
          tax: 1.28,
          total: 17.27,
          orderItems: {
            create: [{
              quantity: 1,
              basePrice: 15.99,
              totalPrice: 15.99,
              notes: 'Test pizza order'
            }]
          }
        },
        include: {
          orderItems: true
        }
      });
      
      console.log('✅ Test order created:', {
        id: testOrder.id,
        orderNumber: testOrder.orderNumber,
        customerEmail: testOrder.customerEmail,
        total: testOrder.total
      });
      
      return testOrder;
    } else {
      console.log(`✅ Found ${orders.length} orders:`);
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ${order.orderNumber || order.id.slice(-8)}`);
        console.log(`   Email: ${order.user?.email || order.customerEmail || 'No email'}`);
        console.log(`   Total: $${order.total}`);
        console.log(`   Items: ${order.orderItems.length}`);
        console.log(`   Created: ${order.createdAt.toLocaleDateString()}\n`);
      });
      
      return orders[0]; // Return the latest order
    }
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders().catch(console.error);
