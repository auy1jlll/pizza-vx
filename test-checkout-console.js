// Copy and paste this entire script into your browser console (F12)
// while on http://localhost:3005

console.log('🧪 TESTING CHECKOUT FLOW...');

// Test checkout API directly
const testCheckout = async () => {
  const testOrder = {
    customer: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0123'
    },
    orderType: 'PICKUP',
    paymentMethod: 'CASH',
    items: [
      {
        pizzaSizeId: '1',
        pizzaCrustId: '1',
        pizzaSauceId: '1',
        quantity: 1,
        basePrice: 12.99,
        totalPrice: 12.99,
        toppings: []
      }
    ],
    subtotal: 12.99,
    deliveryFee: 0,
    tax: 1.04,
    total: 14.03
  };

  try {
    console.log('📤 Submitting test order...');
    console.log('Order data:', testOrder);
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    console.log('📨 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! API Response:', result);
      
      if (result.data?.orderId) {
        console.log('🎯 Order ID found:', result.data.orderId);
        console.log('🔗 Confirmation URL should be:', `/order/${result.data.orderId}`);
        
        // Test if the order page exists
        const orderTest = await fetch(`/api/orders/${result.data.orderId}`);
        console.log('📋 Order page API status:', orderTest.status);
        
        if (orderTest.ok) {
          console.log('✅ Order page API works!');
          console.log('🚀 You can manually visit:', `http://localhost:3005/order/${result.data.orderId}`);
        } else {
          console.log('❌ Order page API failed');
        }
      } else {
        console.log('❌ No orderId in response!');
        console.log('Response structure:', Object.keys(result));
        console.log('Data structure:', result.data ? Object.keys(result.data) : 'No data property');
      }
    } else {
      const error = await response.json();
      console.log('❌ API Error:', error);
    }
  } catch (err) {
    console.log('💥 Network Error:', err);
  }
};

testCheckout();
