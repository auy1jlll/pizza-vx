console.log('🔍 TESTING CART DATA STRUCTURES');
console.log('Copy and paste this code in the browser console:');
console.log('');

const testCode = `
// Clear cart
localStorage.removeItem('menuCart');

// Test Structure: Based on what the checkout API expects
const testItem = {
  id: 'menu-test-debug',
  type: 'menu',
  name: 'Test BBQ Ribs',
  menuItemName: 'Test BBQ Ribs',
  category: 'dinner-plates',
  categorySlug: 'dinner-plates',
  basePrice: 19.99,
  price: 19.99,
  totalPrice: 19.99,
  quantity: 1,
  customizations: [
    {
      optionId: 'test-option-1',
      name: 'Fries',
      groupName: 'Side Choice',
      quantity: 1,
      priceModifier: 0
    },
    {
      optionId: 'test-option-2', 
      name: 'Regular',
      groupName: 'Size',
      quantity: 1,
      priceModifier: 0
    }
  ]
};

// Add to cart
localStorage.setItem('menuCart', JSON.stringify([testItem]));
console.log('✅ Added test item:', testItem);
console.log('🔄 Reloading page...');
window.location.reload();
`;

console.log(testCode);
console.log('');
console.log('This will test if the flat customization structure works correctly.');
