// Test script to verify cart pricing calculations
console.log('=== Cart Pricing Test ===');

// Simulate a cart item with pre-calculated totalPrice (like from build-pizza)
const cartItemWithTotal = {
  id: 'test-1',
  totalPrice: 15.45, // Pre-calculated from build-pizza
  quantity: 1,
  basePrice: 11.25, // This is different from totalPrice
  // Other properties...
};

// Simulate the old calculation (incorrect)
const oldCalculation = cartItemWithTotal.basePrice * cartItemWithTotal.quantity;
console.log('Old calculation (incorrect):', oldCalculation); // Would give $11.25

// Simulate the new calculation (correct)
const newCalculation = cartItemWithTotal.totalPrice * cartItemWithTotal.quantity;
console.log('New calculation (correct):', newCalculation); // Should give $15.45

console.log('✅ The fix should use totalPrice instead of recalculating from basePrice');
