// Test the new scheduling functionality
const testSchedulingFeature = async () => {
  console.log('🧪 Testing Future Order Scheduling Feature');
  
  try {
    // Test 1: Check if scheduling form loads properly
    console.log('\n📋 Test 1: Checking checkout page');
    const response = await fetch('http://localhost:3005/checkout');
    console.log('✅ Checkout page loads:', response.ok);
    
    // Test 2: Create a scheduled order (7 days in future)
    console.log('\n📅 Test 2: Creating scheduled order');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3); // 3 days from now
    const scheduledDate = futureDate.toISOString().split('T')[0];
    const scheduledTime = '14:30'; // 2:30 PM
    
    const orderData = {
      orderType: 'PICKUP',
      scheduleType: 'LATER',
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-0123'
      },
      items: [
        {
          type: 'pizza',
          id: 'test-pizza',
          quantity: 1,
          size: { name: 'Medium', basePrice: 12.99 },
          crust: { name: 'Regular', priceModifier: 0 },
          sauce: { name: 'Marinara', priceModifier: 0 },
          toppings: []
        }
      ],
      subtotal: 12.99,
      deliveryFee: 0,
      tax: 1.04,
      total: 14.03,
      notes: 'Test scheduled order'
    };

    const orderResponse = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const orderResult = await orderResponse.json();
    
    if (orderResponse.ok) {
      console.log('✅ Scheduled order created successfully!');
      console.log(`📦 Order Number: ${orderResult.data?.orderNumber}`);
      console.log(`📅 Scheduled for: ${scheduledDate} at ${scheduledTime}`);
      
      // Test 3: Verify the order has correct scheduling data
      console.log('\n🔍 Test 3: Verifying order data');
      if (orderResult.data?.scheduleType === 'LATER') {
        console.log('✅ Schedule type correctly saved as LATER');
      } else {
        console.log('❌ Schedule type not saved correctly');
      }
      
      if (orderResult.data?.scheduledTime) {
        console.log('✅ Scheduled time saved');
      } else {
        console.log('❌ Scheduled time not saved');
      }
      
    } else {
      console.log('❌ Order creation failed:', orderResult);
    }

    // Test 4: Test validation (order in the past should fail)
    console.log('\n⚠️  Test 4: Testing validation (past time)');
    const pastOrderData = {
      ...orderData,
      scheduledDate: '2024-01-01',
      scheduledTime: '12:00'
    };

    const pastOrderResponse = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pastOrderData)
    });

    if (!pastOrderResponse.ok) {
      console.log('✅ Past order validation working (correctly rejected)');
    } else {
      console.log('❌ Past order validation failed (should have been rejected)');
    }

    console.log('\n🎉 Scheduling feature tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testSchedulingFeature();
