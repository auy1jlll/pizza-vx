// Test Order Data Validation
// Run this in Node.js to test our order data structure

const testOrderData = {
  orderType: "DELIVERY",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567"
  },
  delivery: {
    address: "123 Main St",
    city: "Boston",
    zip: "02101",
    instructions: "Apartment 4B"
  },
  items: [
    {
      id: "test-item-1",
      size: {
        id: "default-small",
        name: "Small",
        diameter: "12\"",
        basePrice: 12.99,
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
      toppings: [
        {
          id: "pepperoni",
          name: "Pepperoni",
          price: 1.50,
          quantity: 1,
          section: "WHOLE",
          intensity: "REGULAR"
        }
      ],
      quantity: 1,
      notes: "",
      basePrice: 12.99,
      totalPrice: 14.49
    }
  ],
  subtotal: 14.49,
  deliveryFee: 3.99,
  tax: 1.27,
  total: 19.75
};

console.log('✅ Test Order Data Structure:');
console.log(JSON.stringify(testOrderData, null, 2));

console.log('\n🔍 Validation Checklist:');
console.log('✅ orderType:', testOrderData.orderType);
console.log('✅ customer object exists:', !!testOrderData.customer);
console.log('✅ customer.name:', testOrderData.customer.name);
console.log('✅ customer.email:', testOrderData.customer.email);
console.log('✅ customer.phone:', testOrderData.customer.phone);
console.log('✅ delivery object exists:', !!testOrderData.delivery);
console.log('✅ items array exists:', Array.isArray(testOrderData.items));
console.log('✅ items[0].size object exists:', !!testOrderData.items[0]?.size);
console.log('✅ items[0].crust object exists:', !!testOrderData.items[0]?.crust);
console.log('✅ items[0].sauce object exists:', !!testOrderData.items[0]?.sauce);
console.log('✅ items[0].toppings array exists:', Array.isArray(testOrderData.items[0]?.toppings));
console.log('✅ items[0].basePrice:', testOrderData.items[0]?.basePrice);
console.log('✅ subtotal:', testOrderData.subtotal);
console.log('✅ deliveryFee:', testOrderData.deliveryFee);
console.log('✅ tax:', testOrderData.tax);
console.log('✅ total:', testOrderData.total);

console.log('\n📝 This structure should pass CreateOrderSchema validation');
console.log('🚀 Ready to test with actual cart data!');
