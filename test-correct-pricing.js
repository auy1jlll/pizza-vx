// Test the pricing fix by sending a correctly calculated order
const testOrderWithCorrectPricing = {
  orderType: "PICKUP",
  customer: {
    name: "Test Customer",
    email: "test@example.com",
    phone: "555-123-4567"
  },
  items: [
    {
      id: "test-item-1",
      size: {
        id: "default-small",
        name: "Small",
        diameter: "12\"",
        basePrice: 15.99,
        isActive: true,
        sortOrder: 0
      },
      crust: {
        id: "default-traditional",
        name: "Traditional",
        description: "",
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      sauce: {
        id: "default-tomato",
        name: "Tomato",
        description: "",
        color: "",
        spiceLevel: 0,
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      toppings: [],
      quantity: 1,
      notes: "",
      basePrice: 15.99,
      totalPrice: 15.99
    }
  ],
  subtotal: 15.99,
  deliveryFee: 0,  // PICKUP order, no delivery fee
  tax: +(15.99 * 0.0825).toFixed(2),  // Use 8.25% tax rate from database
  total: +(15.99 + (15.99 * 0.0825)).toFixed(2)
};

// Calculate the exact values
const subtotal = 15.99;
const taxRate = 8.25 / 100;  // 8.25% as decimal
const tax = +(subtotal * taxRate).toFixed(2);
const total = +(subtotal + tax).toFixed(2);

console.log('🧮 Calculated Values:');
console.log('Subtotal:', subtotal);
console.log('Tax Rate:', (taxRate * 100).toFixed(2) + '%');
console.log('Tax Amount:', tax);
console.log('Total:', total);

testOrderWithCorrectPricing.tax = tax;
testOrderWithCorrectPricing.total = total;

console.log('\n📦 Test Order Data:');
console.log(JSON.stringify(testOrderWithCorrectPricing, null, 2));
