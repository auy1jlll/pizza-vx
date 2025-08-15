// Test Zod Schema Validation
const { CreateOrderSchema, validateSchema } = require('./src/lib/schemas.ts');

console.log('🔴 Testing Zod Schema Validation...\n');

// Test 1: Valid order data
const validOrder = {
  items: [
    {
      size: { id: "test-size", name: "Medium", diameter: "12 inches", basePrice: 12.99, isActive: true, sortOrder: 1 },
      crust: { id: "test-crust", name: "Thin", priceModifier: 0, isActive: true, sortOrder: 1 },
      sauce: { id: "test-sauce", name: "Marinara", spiceLevel: 2, priceModifier: 0, isActive: true, sortOrder: 1 },
      toppings: [
        { id: "test-topping", name: "Pepperoni", price: 2.99, quantity: 1, section: "WHOLE", intensity: "REGULAR" }
      ],
      quantity: 1,
      basePrice: 12.99,
      totalPrice: 15.98
    }
  ],
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567"
  },
  delivery: {
    address: "123 Main St",
    city: "Anytown",
    zip: "12345"
  },
  orderType: "DELIVERY",
  subtotal: 15.98,
  deliveryFee: 3.99,
  tax: 1.28,
  total: 21.25
};

// Test 2: Invalid order data
const invalidOrder = {
  items: [],
  customer: {
    name: "",
    email: "invalid-email",
    phone: "123"
  },
  orderType: "INVALID_TYPE",
  subtotal: -1,
  total: 0
};

console.log('✅ Testing valid order...');
const validResult = validateSchema(CreateOrderSchema, validOrder);
if (validResult.success) {
  console.log('   ✓ Valid order passed validation');
  console.log('   ✓ Customer:', validResult.data.customer.name);
  console.log('   ✓ Items:', validResult.data.items.length);
  console.log('   ✓ Total:', validResult.data.total);
} else {
  console.log('   ✗ Valid order failed:', validResult.error);
}

console.log('\n❌ Testing invalid order...');
const invalidResult = validateSchema(CreateOrderSchema, invalidOrder);
if (invalidResult.success) {
  console.log('   ✗ Invalid order incorrectly passed validation');
} else {
  console.log('   ✓ Invalid order correctly failed validation');
  console.log('   ✓ Errors:', invalidResult.error);
}

console.log('\n🔴 Schema validation test complete!');
