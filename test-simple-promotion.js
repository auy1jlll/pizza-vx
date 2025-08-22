#!/usr/bin/env node

console.log('🧪 Testing Promotion Logic\n');

// Simple promotion calculation logic
function calculateBuyOneGetSecondHalfOff(items) {
  const pizzaItems = items.filter(item => item.type === 'pizza');
  
  if (pizzaItems.length < 2) {
    return {
      originalTotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      discountAmount: 0,
      finalTotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      message: 'Need at least 2 pizzas for promotion'
    };
  }

  // Expand items by quantity
  const expandedPizzas = [];
  pizzaItems.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      expandedPizzas.push({
        ...item,
        id: `${item.id}-${i}`,
        quantity: 1
      });
    }
  });

  // Sort by price (highest to lowest)
  expandedPizzas.sort((a, b) => b.totalPrice - a.totalPrice);

  let totalDiscount = 0;
  const discountDetails = [];

  // Process pairs - discount the cheaper pizza in each pair
  for (let i = 0; i < expandedPizzas.length - 1; i += 2) {
    const expensivePizza = expandedPizzas[i];
    const cheaperPizza = expandedPizzas[i + 1];
    
    const discount = cheaperPizza.totalPrice * 0.5; // 50% off the cheaper one
    totalDiscount += discount;

    discountDetails.push({
      expensiveItem: `${expensivePizza.name || 'Pizza'} ($${expensivePizza.totalPrice})`,
      discountedItem: `${cheaperPizza.name || 'Pizza'} ($${cheaperPizza.totalPrice})`,
      discount: discount,
      finalPrice: cheaperPizza.totalPrice - discount
    });
  }

  const originalTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    originalTotal,
    discountAmount: totalDiscount,
    finalTotal: originalTotal - totalDiscount,
    discountDetails
  };
}

// Test data
const testItems = [
  {
    id: 'pizza-1',
    name: 'Large Pepperoni Pizza',
    totalPrice: 24.99,
    quantity: 1,
    type: 'pizza'
  },
  {
    id: 'pizza-2', 
    name: 'Medium Margherita Pizza',
    totalPrice: 18.99,
    quantity: 1,
    type: 'pizza'
  }
];

console.log('🍕 Test Order: Large Pepperoni ($24.99) + Medium Margherita ($18.99)');

const result = calculateBuyOneGetSecondHalfOff(testItems);

console.log('\n📊 Results:');
console.log(`Original Total: $${result.originalTotal.toFixed(2)}`);
console.log(`Discount: $${result.discountAmount.toFixed(2)}`);
console.log(`Final Total: $${result.finalTotal.toFixed(2)}`);

if (result.discountDetails) {
  console.log('\n💰 Discount Details:');
  result.discountDetails.forEach((detail, index) => {
    console.log(`${index + 1}. Pair: ${detail.expensiveItem} + ${detail.discountedItem}`);
    console.log(`   Discount: $${detail.discount.toFixed(2)} (50% off cheaper pizza)`);
    console.log(`   Cheaper pizza final price: $${detail.finalPrice.toFixed(2)}`);
  });
}

// Verify calculation
const expectedDiscount = 18.99 * 0.5; // $9.495
const expectedTotal = 24.99 + 18.99 - expectedDiscount; // $34.485

console.log('\n🧮 Verification:');
console.log(`Expected discount: $${expectedDiscount.toFixed(2)}`);
console.log(`Expected total: $${expectedTotal.toFixed(2)}`);
console.log(`Calculation: ${Math.abs(result.discountAmount - expectedDiscount) < 0.01 ? '✅ CORRECT' : '❌ INCORRECT'}`);

// Test with 3 pizzas
console.log('\n\n🍕 Test with 3 pizzas:');
const threeItems = [
  ...testItems,
  {
    id: 'pizza-3',
    name: 'Small Hawaiian Pizza',
    totalPrice: 15.99,
    quantity: 1,
    type: 'pizza'
  }
];

const result3 = calculateBuyOneGetSecondHalfOff(threeItems);
console.log(`Original Total: $${result3.originalTotal.toFixed(2)}`);
console.log(`Discount: $${result3.discountAmount.toFixed(2)}`);
console.log(`Final Total: $${result3.finalTotal.toFixed(2)}`);

console.log('\n💰 Discount Logic:');
console.log('1. Large ($24.99) pairs with Medium ($18.99) → Medium gets 50% off = $9.50 discount');
console.log('2. Small ($15.99) has no pair → No discount');
console.log('3. Total discount: $9.50');

console.log('\n✅ Promotion system logic test completed!');
