const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSandwichTestOrder() {
  try {
    console.log('🥪 Creating sandwich test order with multiple customizations...\n');

    // Find a sandwich with customizations
    const sandwich = await prisma.menuItem.findFirst({
      where: {
        category: { slug: 'sandwiches' }
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

    if (!sandwich) {
      console.log('❌ No sandwiches found');
      return;
    }

    console.log(`✅ Found sandwich: ${sandwich.name}`);

    // Create test order
    const order = await prisma.order.create({
      data: {
        orderNumber: `SANDWICH${Date.now()}`,
        userId: null,
        customerName: 'Sandwich Test Customer',
        customerEmail: 'sandwich@kitchen.com',
        customerPhone: '555-SANDWICH',
        orderType: 'PICKUP',
        subtotal: 12.99,
        tax: 1.04,
        total: 14.03,
        notes: 'Sandwich test order with customizations',
        status: 'PENDING'
      }
    });

    console.log(`✅ Created test order: ${order.orderNumber}`);

    // Create order item for sandwich
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: sandwich.id,
        quantity: 1,
        basePrice: sandwich.basePrice,
        totalPrice: 12.99,
        notes: `**${sandwich.name}** (${sandwich.category.name})`
      }
    });

    console.log(`✅ Created order item for: ${sandwich.name}`);

    // Add some common sandwich customizations manually if needed
    const customizationGroups = await prisma.customizationGroup.findMany({
      where: {
        OR: [
          { name: { contains: 'Bread' } },
          { name: { contains: 'Cheese' } },
          { name: { contains: 'Add-ons' } },
          { name: { contains: 'Side' } }
        ]
      },
      include: {
        options: {
          where: { isActive: true }
        }
      }
    });

    // Let's add some manual customizations to really test the display
    let customizationCount = 0;
    
    // Find and add bread customization
    const breadGroup = customizationGroups.find(g => g.name.toLowerCase().includes('bread'));
    if (breadGroup && breadGroup.options.length > 0) {
      const breadOption = breadGroup.options.find(o => o.name.toLowerCase().includes('whole')) || breadGroup.options[0];
      await prisma.orderItemCustomization.create({
        data: {
          orderItemId: orderItem.id,
          customizationOptionId: breadOption.id,
          quantity: 1,
          price: breadOption.priceModifier
        }
      });
      console.log(`   ✅ ${breadGroup.name}: ${breadOption.name} (+$${breadOption.priceModifier})`);
      customizationCount++;
    }

    // Find and add cheese customization
    const cheeseGroup = customizationGroups.find(g => g.name.toLowerCase().includes('cheese'));
    if (cheeseGroup && cheeseGroup.options.length > 0) {
      const cheeseOption = cheeseGroup.options.find(o => o.name.toLowerCase().includes('cheddar')) || cheeseGroup.options[0];
      await prisma.orderItemCustomization.create({
        data: {
          orderItemId: orderItem.id,
          customizationOptionId: cheeseOption.id,
          quantity: 1,
          price: cheeseOption.priceModifier
        }
      });
      console.log(`   ✅ ${cheeseGroup.name}: ${cheeseOption.name} (+$${cheeseOption.priceModifier})`);
      customizationCount++;
    }

    // Find and add side customization
    const sideGroup = customizationGroups.find(g => g.name.toLowerCase().includes('side'));
    if (sideGroup && sideGroup.options.length > 0) {
      const sideOption = sideGroup.options.find(o => o.name.toLowerCase().includes('fries')) || sideGroup.options[0];
      await prisma.orderItemCustomization.create({
        data: {
          orderItemId: orderItem.id,
          customizationOptionId: sideOption.id,
          quantity: 1,
          price: sideOption.priceModifier
        }
      });
      console.log(`   ✅ ${sideGroup.name}: ${sideOption.name} (+$${sideOption.priceModifier})`);
      customizationCount++;
    }

    console.log(`\n🎉 Sandwich test order created successfully!`);
    console.log(`📋 Order Number: ${order.orderNumber}`);
    console.log(`🥪 Menu Item: ${sandwich.name}`);
    console.log(`🎛️  Total Customizations: ${customizationCount}`);
    console.log(`📞 Pickup Order - Phone: ${order.customerPhone}`);
    console.log(`\n💡 Check the kitchen display at: http://localhost:3005/admin/kitchen`);

  } catch (error) {
    console.error('❌ Error creating sandwich test order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwichTestOrder();
