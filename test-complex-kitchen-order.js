const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createComplexTestOrder() {
  try {
    console.log('🧪 Creating complex test order with multiple menu item customizations...\n');

    // Find a sandwich or dinner item with multiple customization groups
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        OR: [
          { category: { slug: 'sandwiches' } },
          { category: { slug: 'dinner-plates' } }
        ],
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
                  where: { isActive: true }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!menuItem) {
      console.log('❌ No complex menu items found');
      return;
    }

    console.log(`✅ Found menu item: ${menuItem.name} (${menuItem.category.name})`);
    console.log(`   Available customization groups: ${menuItem.customizationGroups.length}`);

    // Create a test order
    const order = await prisma.order.create({
      data: {
        orderNumber: `COMPLEX${Date.now()}`,
        userId: null,
        customerName: 'Complex Test Customer',
        customerEmail: 'complex@kitchen.com',
        customerPhone: '555-COMPLEX',
        orderType: 'DELIVERY',
        deliveryAddress: '123 Kitchen Test St',
        deliveryCity: 'TestCity',
        deliveryZip: '12345',
        subtotal: 18.99,
        deliveryFee: 3.50,
        tax: 1.80,
        total: 24.29,
        notes: 'Complex test order with multiple customizations',
        status: 'PENDING'
      }
    });

    console.log(`✅ Created test order: ${order.orderNumber}`);

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity: 2, // Order 2 of them
        basePrice: menuItem.basePrice,
        totalPrice: 18.99,
        notes: `**${menuItem.name}** (${menuItem.category.name})`
      }
    });

    console.log(`✅ Created order item for: 2x ${menuItem.name}`);

    // Add multiple customizations
    let totalCustomizations = 0;
    for (const group of menuItem.customizationGroups) {
      const options = group.customizationGroup.options;
      if (options.length > 0) {
        
        if (group.customizationGroup.type === 'SINGLE_SELECT') {
          // For single select, pick the second option if available
          const option = options[1] || options[0];
          await prisma.orderItemCustomization.create({
            data: {
              orderItemId: orderItem.id,
              customizationOptionId: option.id,
              quantity: 1,
              price: option.priceModifier
            }
          });
          console.log(`   ✅ ${group.customizationGroup.name}: ${option.name} (+$${option.priceModifier})`);
          totalCustomizations++;
        } 
        else if (group.customizationGroup.type === 'MULTI_SELECT') {
          // For multi-select, pick multiple options
          const selectedOptions = options.slice(0, Math.min(3, options.length));
          for (const option of selectedOptions) {
            await prisma.orderItemCustomization.create({
              data: {
                orderItemId: orderItem.id,
                customizationOptionId: option.id,
                quantity: 1,
                price: option.priceModifier
              }
            });
            console.log(`   ✅ ${group.customizationGroup.name}: ${option.name} (+$${option.priceModifier})`);
            totalCustomizations++;
          }
        }
        else if (group.customizationGroup.type === 'QUANTITY_SELECT') {
          // For quantity select, pick first option with quantity 2
          const option = options[0];
          await prisma.orderItemCustomization.create({
            data: {
              orderItemId: orderItem.id,
              customizationOptionId: option.id,
              quantity: 2,
              price: option.priceModifier * 2
            }
          });
          console.log(`   ✅ ${group.customizationGroup.name}: 2x ${option.name} (+$${(option.priceModifier * 2).toFixed(2)})`);
          totalCustomizations++;
        }
      }
    }

    console.log(`\n🎉 Complex test order created successfully!`);
    console.log(`📋 Order Number: ${order.orderNumber}`);
    console.log(`🍽️  Menu Item: 2x ${menuItem.name}`);
    console.log(`🎛️  Total Customizations: ${totalCustomizations}`);
    console.log(`🚚 Delivery Order to: ${order.deliveryAddress}, ${order.deliveryCity}`);
    console.log(`\n💡 Check the kitchen display at: http://localhost:3005/admin/kitchen`);

  } catch (error) {
    console.error('❌ Error creating complex test order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createComplexTestOrder();
