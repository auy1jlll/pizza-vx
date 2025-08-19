const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrderWithMenuCustomizations() {
  try {
    console.log('🧪 Creating test order with menu item customizations...\n');

    // Find a menu item that has customizations
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        customizationGroups: {
          some: {}
        }
      },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  take: 2 // Get first 2 options for testing
                }
              }
            }
          }
        }
      }
    });

    if (!menuItem) {
      console.log('❌ No menu items with customizations found');
      return;
    }

    console.log(`✅ Found menu item: ${menuItem.name} (${menuItem.category.name})`);
    console.log(`   Available customization groups: ${menuItem.customizationGroups.length}`);

    // Create a test order
    const order = await prisma.order.create({
      data: {
        orderNumber: `TEST${Date.now()}`,
        userId: null,
        customerName: 'Test Customer Kitchen',
        customerEmail: 'test@kitchen.com',
        customerPhone: '555-KITCHEN',
        orderType: 'PICKUP',
        subtotal: 15.99,
        deliveryFee: 0,
        tax: 1.28,
        total: 17.27,
        notes: 'Test order for kitchen display customizations',
        status: 'PENDING'
      }
    });

    console.log(`✅ Created test order: ${order.orderNumber}`);

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity: 1,
        basePrice: menuItem.basePrice,
        totalPrice: 15.99,
        notes: `**${menuItem.name}** (${menuItem.category.name})`
      }
    });

    console.log(`✅ Created order item for: ${menuItem.name}`);

    // Add customizations from available options
    let customizationCount = 0;
    for (const group of menuItem.customizationGroups) {
      if (group.customizationGroup.options.length > 0) {
        const option = group.customizationGroup.options[0]; // Take first option
        
        await prisma.orderItemCustomization.create({
          data: {
            orderItemId: orderItem.id,
            customizationOptionId: option.id,
            quantity: 1,
            price: option.priceModifier
          }
        });

        console.log(`   ✅ Added customization: ${group.customizationGroup.name} → ${option.name} (+$${option.priceModifier})`);
        customizationCount++;
      }
    }

    console.log(`\n🎉 Test order created successfully!`);
    console.log(`📋 Order Number: ${order.orderNumber}`);
    console.log(`🍽️  Menu Item: ${menuItem.name}`);
    console.log(`🎛️  Customizations: ${customizationCount}`);
    console.log(`\n💡 Check the kitchen display at: http://localhost:3005/admin/kitchen`);

  } catch (error) {
    console.error('❌ Error creating test order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrderWithMenuCustomizations();
