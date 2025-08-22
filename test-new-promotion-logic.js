// Test the updated promotion logic
console.log('🧪 Testing Updated Promotion Logic');
console.log('Rule: For every 2 pizzas, discount the cheaper one by 50%');
console.log('');

// Simulate the CartItem interface and PromotionService
const testCases = [
  {
    description: "2 pizzas (User's case): 2x Small Calzone $21.50 each",
    pizzas: [
      { id: '1', name: 'Small Calzone Pizza', totalPrice: 21.50, type: 'pizza', quantity: 1 },
      { id: '2', name: 'Small Calzone Pizza', totalPrice: 21.50, type: 'pizza', quantity: 1 }
    ],
    expectedDiscounts: 1,
    expectedDiscountAmount: 10.75
  },
  {
    description: "3 pizzas: Small $15, Medium $20, Large $25",
    pizzas: [
      { id: '1', name: 'Small Pizza', totalPrice: 15.00, type: 'pizza', quantity: 1 },
      { id: '2', name: 'Medium Pizza', totalPrice: 20.00, type: 'pizza', quantity: 1 },
      { id: '3', name: 'Large Pizza', totalPrice: 25.00, type: 'pizza', quantity: 1 }
    ],
    expectedDiscounts: 1,
    expectedDiscountAmount: 7.50 // 50% off the $15 pizza
  },
  {
    description: "4 pizzas: 2x Small $15, 2x Large $25",
    pizzas: [
      { id: '1', name: 'Small Pizza', totalPrice: 15.00, type: 'pizza', quantity: 1 },
      { id: '2', name: 'Small Pizza', totalPrice: 15.00, type: 'pizza', quantity: 1 },
      { id: '3', name: 'Large Pizza', totalPrice: 25.00, type: 'pizza', quantity: 1 },
      { id: '4', name: 'Large Pizza', totalPrice: 25.00, type: 'pizza', quantity: 1 }
    ],
    expectedDiscounts: 2,
    expectedDiscountAmount: 15.00 // 50% off both $15 pizzas
  },
  {
    description: "10 pizzas: Various prices",
    pizzas: [
      { id: '1', name: 'Small Pizza', totalPrice: 10.00, type: 'pizza', quantity: 1 },
      { id: '2', name: 'Small Pizza', totalPrice: 12.00, type: 'pizza', quantity: 1 },
      { id: '3', name: 'Medium Pizza', totalPrice: 15.00, type: 'pizza', quantity: 1 },
      { id: '4', name: 'Medium Pizza', totalPrice: 18.00, type: 'pizza', quantity: 1 },
      { id: '5', name: 'Large Pizza', totalPrice: 20.00, type: 'pizza', quantity: 1 },
      { id: '6', name: 'Large Pizza', totalPrice: 22.00, type: 'pizza', quantity: 1 },
      { id: '7', name: 'XL Pizza', totalPrice: 25.00, type: 'pizza', quantity: 1 },
      { id: '8', name: 'XL Pizza', totalPrice: 28.00, type: 'pizza', quantity: 1 },
      { id: '9', name: 'Specialty Pizza', totalPrice: 30.00, type: 'pizza', quantity: 1 },
      { id: '10', name: 'Gourmet Pizza', totalPrice: 35.00, type: 'pizza', quantity: 1 }
    ],
    expectedDiscounts: 5,
    expectedDiscountAmount: 42.50 // 50% off: $10, $12, $15, $18, $20 = $37.50
  }
];

// Simple implementation of the promotion logic for testing
function testPromotionLogic(pizzas) {
  if (pizzas.length < 2) {
    return { discounts: 0, discountAmount: 0, originalTotal: pizzas.reduce((sum, p) => sum + p.totalPrice, 0) };
  }

  // Sort by price (ascending) to find cheapest items first
  const sortedPizzas = [...pizzas].sort((a, b) => a.totalPrice - b.totalPrice);
  
  // Calculate number of discounts: floor(total pizzas / 2)
  const numDiscounts = Math.floor(pizzas.length / 2);
  
  let totalDiscount = 0;
  
  // Apply 50% discount to the cheapest pizzas (up to numDiscounts)
  for (let i = 0; i < numDiscounts && i < sortedPizzas.length; i++) {
    const discount = sortedPizzas[i].totalPrice * 0.5;
    totalDiscount += discount;
  }

  const originalTotal = pizzas.reduce((sum, p) => sum + p.totalPrice, 0);
  
  return {
    discounts: numDiscounts,
    discountAmount: totalDiscount,
    originalTotal,
    finalTotal: originalTotal - totalDiscount
  };
}

// Run tests
testCases.forEach((testCase, index) => {
  console.log(`📊 Test Case ${index + 1}: ${testCase.description}`);
  
  const result = testPromotionLogic(testCase.pizzas);
  
  console.log(`   Original Total: $${result.originalTotal.toFixed(2)}`);
  console.log(`   Number of Discounts: ${result.discounts} (expected: ${testCase.expectedDiscounts})`);
  console.log(`   Discount Amount: $${result.discountAmount.toFixed(2)} (expected: $${testCase.expectedDiscountAmount.toFixed(2)})`);
  console.log(`   Final Total: $${result.finalTotal.toFixed(2)}`);
  
  const discountsMatch = result.discounts === testCase.expectedDiscounts;
  const amountMatch = Math.abs(result.discountAmount - testCase.expectedDiscountAmount) < 0.01;
  
  if (discountsMatch && amountMatch) {
    console.log(`   ✅ PASS`);
  } else {
    console.log(`   ❌ FAIL`);
  }
  console.log('');
});

console.log('🎯 User\'s Specific Case Analysis:');
console.log('2x Small Calzone Pizza at $21.50 each = $43.00 total');
console.log('Floor(2 pizzas / 2) = 1 discount');
console.log('50% off cheapest pizza = 50% off $21.50 = $10.75 discount');
console.log('Final total = $43.00 - $10.75 = $32.25');
console.log('Expected in checkout: Subtotal $32.25, Tax ~$2.67, Total ~$34.92');
