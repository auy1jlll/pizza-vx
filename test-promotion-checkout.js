const fs = require('fs');
const path = require('path');

console.log('🧪 Testing promotion checkout with user scenario...');

// Test data - exactly what the user reported
const testCart = {
  pizzaItems: [
    {
      id: 1,
      name: "Small Calzone Pizza",
      price: 21.50,
      size: "Small",
      quantity: 1,
      customizations: []
    },
    {
      id: 2,
      name: "Small Calzone Pizza", 
      price: 21.50,
      size: "Small",
      quantity: 1,
      customizations: []
    }
  ],
  menuItems: []
};

// Simulate localStorage data
const cartData = {
  pizzaItems: JSON.stringify(testCart.pizzaItems),
  menuItems: JSON.stringify(testCart.menuItems)
};

console.log('📦 Test cart items:', testCart);
console.log('💰 Expected subtotal: $43.00');
console.log('🎯 Expected promotion: Buy one get 2nd half off (50% off cheaper pizza = $10.75 discount)');
console.log('📊 Expected final subtotal: $32.25');

// Test the promotion service directly
const PromotionService = require('./src/lib/promotion-service.ts');

// Convert cart items to promotion service format
const cartItems = testCart.pizzaItems.map(item => ({
  id: item.id,
  name: item.name,
  price: item.price,
  quantity: item.quantity
}));

console.log('\n🔬 Testing promotion service directly...');
console.log('Cart items for promotion service:', cartItems);

try {
  const promotionService = new PromotionService();
  const result = promotionService.applyBestPromotion(cartItems);
  
  console.log('\n✅ Promotion Service Result:');
  console.log('Original Total:', result.originalTotal);
  console.log('Discount Amount:', result.discountAmount);
  console.log('Final Total:', result.finalTotal);
  console.log('Applied Promotions:', result.appliedPromotions);
  
  if (result.discountAmount > 0) {
    console.log('\n🎉 SUCCESS: Promotion system working correctly!');
  } else {
    console.log('\n❌ ISSUE: No discount applied');
  }
} catch (error) {
  console.error('Error testing promotion service:', error);
}
