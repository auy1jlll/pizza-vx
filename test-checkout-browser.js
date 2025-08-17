// Simple test to trigger checkout from frontend
// Open this in browser console to test

const testCheckout = async () => {
  console.log('=== TESTING CHECKOUT FLOW ===');
  
  try {
    // Test order submission
    const orderData = {
      customerName: 'Test Customer',
      customerEmail: 'test@test.com',
      customerPhone: '555-0123',
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
      tax: 1.04,
      total: 14.03
    };
    
    console.log('1. Submitting order data:', orderData);
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    console.log('2. Response status:', response.status);
    console.log('3. Response headers:', Object.fromEntries(response.headers));
    
    const result = await response.json();
    console.log('4. Response body:', result);
    
    if (result.success && result.data?.orderId) {
      console.log('5. ✅ Order created with ID:', result.data.orderId);
      console.log('6. 🚀 Attempting redirect to:', `/order/${result.data.orderId}`);
      
      // Test if the order page exists
      const orderPageResponse = await fetch(`/api/orders/${result.data.orderId}`);
      console.log('7. Order page API status:', orderPageResponse.status);
      
      if (orderPageResponse.ok) {
        const orderData = await orderPageResponse.json();
        console.log('8. ✅ Order page data available:', orderData);
        
        // Simulate the redirect
        console.log('9. 🔄 Simulating redirect...');
        window.location.href = `/order/${result.data.orderId}`;
      } else {
        console.log('8. ❌ Order page API failed');
      }
    } else {
      console.log('5. ❌ Order creation failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Checkout test failed:', error);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  testCheckout();
} else {
  console.log('Run this in browser console: testCheckout()');
}
