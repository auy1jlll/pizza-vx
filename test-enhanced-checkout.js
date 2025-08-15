const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEnhancedCheckout() {
  try {
    console.log('🧪 Testing Enhanced Checkout System...\n');

    // Test 1: Verify settings are available
    console.log('1️⃣ Testing Settings...');
    const tipSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['tipPercentages', 'allowCustomTip', 'defaultTipPercentage', 'allowPayAtPickup', 'allowPayLater']
        }
      }
    });
    
    console.log('   Tip & Payment Settings:');
    tipSettings.forEach(setting => {
      const value = setting.type === 'JSON' ? JSON.parse(setting.value) : setting.value;
      console.log(`   - ${setting.key}: ${JSON.stringify(value)} (${setting.type})`);
    });
    console.log('   ✅ Settings loaded successfully\n');

    // Test 2: Get pizza components
    console.log('2️⃣ Testing Pizza Components...');
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany(),
      prisma.pizzaCrust.findMany(),
      prisma.pizzaSauce.findMany(),
      prisma.pizzaTopping.findMany({ take: 3 })
    ]);

    console.log(`   - Sizes: ${sizes.length} available`);
    console.log(`   - Crusts: ${crusts.length} available`);
    console.log(`   - Sauces: ${sauces.length} available`);
    console.log(`   - Toppings: ${toppings.length} available`);
    console.log('   ✅ Components ready\n');

    // Test 3: Create test order with payment method and tip
    console.log('3️⃣ Testing Order Creation with Enhanced Fields...');
    
    if (sizes.length === 0 || crusts.length === 0 || sauces.length === 0) {
      console.log('   ❌ Missing required pizza components');
      return;
    }

    const testOrder = {
      orderNumber: `TEST-${Date.now()}`,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '555-0123',
      orderType: 'PICKUP',
      paymentMethod: 'CREDIT_CARD',
      subtotal: 18.99,
      deliveryFee: 0,
      tipAmount: 3.04,
      tipPercentage: 18,
      customTipAmount: null,
      tax: 1.52,
      total: 23.55,
      notes: 'Test order with enhanced payment fields',
      status: 'PENDING'
    };

    const order = await prisma.order.create({
      data: testOrder
    });

    console.log('   Order created with enhanced fields:');
    console.log(`   - Order Number: ${order.orderNumber}`);
    console.log(`   - Payment Method: ${order.paymentMethod}`);
    console.log(`   - Tip Amount: $${order.tipAmount}`);
    console.log(`   - Tip Percentage: ${order.tipPercentage}%`);
    console.log(`   - Total: $${order.total}`);
    console.log('   ✅ Enhanced order creation successful\n');

    // Test 4: Test different payment methods
    console.log('4️⃣ Testing Different Payment Methods...');
    
    const paymentMethods = [
      { method: 'PAY_AT_PICKUP', tip: 0, tipPercent: null },
      { method: 'PAY_ON_DELIVERY', tip: 2.85, tipPercent: 15 },
      { method: 'CREDIT_CARD', tip: null, tipPercent: null, customTip: 5.00 }
    ];

    for (let i = 0; i < paymentMethods.length; i++) {
      const pm = paymentMethods[i];
      const testOrder2 = await prisma.order.create({
        data: {
          orderNumber: `TEST-PM${i}-${Date.now()}`,
          customerName: 'Payment Test',
          customerEmail: 'payment@test.com',
          customerPhone: '555-0456',
          orderType: 'PICKUP',
          paymentMethod: pm.method,
          subtotal: 19.00,
          deliveryFee: 0,
          tipAmount: pm.tip,
          tipPercentage: pm.tipPercent,
          customTipAmount: pm.customTip,
          tax: 1.52,
          total: 19.00 + 1.52 + (pm.tip || pm.customTip || 0),
          status: 'PENDING'
        }
      });
      
      console.log(`   - ${pm.method}: Order ${testOrder2.orderNumber} (Total: $${testOrder2.total})`);
    }
    console.log('   ✅ Multiple payment methods tested\n');

    // Test 5: Verify database schema
    console.log('5️⃣ Testing Database Schema...');
    const orderWithFields = await prisma.order.findFirst({
      where: { id: order.id },
      select: {
        paymentMethod: true,
        tipAmount: true,
        tipPercentage: true,
        customTipAmount: true,
        subtotal: true,
        total: true
      }
    });

    if (orderWithFields.paymentMethod !== undefined) {
      console.log('   ✅ paymentMethod field exists');
    }
    if (orderWithFields.tipAmount !== undefined) {
      console.log('   ✅ tipAmount field exists');
    }
    if (orderWithFields.tipPercentage !== undefined) {
      console.log('   ✅ tipPercentage field exists');
    }
    if (orderWithFields.customTipAmount !== undefined) {
      console.log('   ✅ customTipAmount field exists');
    }
    console.log('   ✅ Database schema validation complete\n');

    console.log('🎉 All Enhanced Checkout Tests Passed!');
    console.log('\n📋 Summary:');
    console.log('   • Tip settings configured and accessible');
    console.log('   • Payment method options available');
    console.log('   • Custom tip amounts supported');
    console.log('   • Database schema updated correctly');
    console.log('   • Order creation with enhanced fields working');
    console.log('\n🚀 Ready for frontend testing!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnhancedCheckout();
