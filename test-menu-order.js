const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestOrder() {
  try {
    console.log('Creating test order with menu item...');
    
    // First, get a menu item
    const menuItem = await prisma.menuItem.findFirst({
      where: { isActive: true }
    });
    
    if (!menuItem) {
      console.log('No active menu items found. Creating one...');
      const newMenuItem = await prisma.menuItem.create({
        data: {
          name: 'Italian Sub',
          description: 'Delicious Italian submarine sandwich',
          basePrice: 12.99,
          category: 'SANDWICH',
          isActive: true,
          sortOrder: 1
        }
      });
      console.log('Created menu item:', newMenuItem.name);
      menuItem.id = newMenuItem.id;
    }
    
    // Create an order
    const order = await prisma.order.create({
      data: {
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '555-1234',
        orderType: 'PICKUP',
        status: 'CONFIRMED',
        subtotal: 12.99,
        tax: 1.30,
        total: 14.29,
        orderItems: {
          create: [
            {
              menuItemId: menuItem.id,
              quantity: 1,
              basePrice: 12.99,
              totalPrice: 12.99,
              notes: 'Bread Type: Small Sub Roll, Meat: Salami, Cheese: Provolone'
            }
          ]
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });
    
    console.log('✅ Created test order:', order.id);
    console.log('Order items:');
    order.orderItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.menuItem?.name || 'Unknown'} - $${item.totalPrice}`);
      console.log(`     Notes: ${item.notes}`);
    });
    
    console.log(`\n🌐 View confirmation at: http://localhost:3005/order/${order.id}`);
    
  } catch (error) {
    console.error('Error creating test order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrder();
