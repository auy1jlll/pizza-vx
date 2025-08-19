const fetch = require('node-fetch');

async function testMenuItemPricing() {
  console.log('🧪 Testing Menu Item Pricing - Imported Ham');
  
  // Simulate the cart data structure based on what you showed me
  const cartData = {
    pizzaItems: [],
    menuItems: [
      {
        id: "menu-1755565252125-uiwhh2a6l",
        type: "menu",
        menuItemId: "cmeg9p09p001fvkx0si55gox9",
        name: "Imported Ham",
        quantity: 1,
        basePrice: 11.99, // This seems to be the base price
        price: 17.49, // This is what's showing in cart display
        customizations: [
          // Bread Type: Spinach Wrap (+$1.00)
          { optionId: "bread-spinach-wrap", priceModifier: 1.00, groupName: "Bread Type", optionName: "Spinach Wrap" },
          
          // Condiments (no charge items)
          { optionId: "condiment-oil-vinegar", priceModifier: 0, groupName: "Condiments", optionName: "Oil & Vinegar" },
          { optionId: "condiment-mayo", priceModifier: 0, groupName: "Condiments", optionName: "Mayonnaise" },
          { optionId: "condiment-pickles", priceModifier: 0, groupName: "Condiments", optionName: "Pickles" },
          { optionId: "condiment-hot-peppers", priceModifier: 0, groupName: "Condiments", optionName: "Hot Peppers" },
          
          // Toppings (some with charges)
          { optionId: "topping-cucumbers", priceModifier: 0, groupName: "Toppings", optionName: "Cucumbers" },
          { optionId: "topping-green-peppers", priceModifier: 0, groupName: "Toppings", optionName: "Green Peppers" },
          { optionId: "topping-onions", priceModifier: 0, groupName: "Toppings", optionName: "Onions" },
          { optionId: "topping-tomatoes", priceModifier: 0, groupName: "Toppings", optionName: "Tomatoes" },
          { optionId: "topping-american-cheese", priceModifier: 0.50, groupName: "Toppings", optionName: "American Cheese" },
          { optionId: "topping-cheese", priceModifier: 1.50, groupName: "Toppings", optionName: "Cheese" },
          { optionId: "topping-onion", priceModifier: 0, groupName: "Toppings", optionName: "Onion" },
          { optionId: "topping-tomato", priceModifier: 0, groupName: "Toppings", optionName: "Tomato" },
          { optionId: "topping-lettuce", priceModifier: 0, groupName: "Toppings", optionName: "Lettuce" },
          { optionId: "topping-bacon", priceModifier: 2.50, groupName: "Toppings", optionName: "Bacon" }
        ]
      }
    ]
  };

  // Calculate expected price manually
  let expectedPrice = 11.99; // base price
  expectedPrice += 1.00; // Spinach Wrap
  expectedPrice += 0.50; // American Cheese
  expectedPrice += 1.50; // Cheese
  expectedPrice += 2.50; // Bacon
  console.log('🧮 Manual calculation: $11.99 + $1.00 + $0.50 + $1.50 + $2.50 = $', expectedPrice.toFixed(2));

  try {
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData)
    });

    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok && result.success) {
      console.log('✅ Price refresh successful!');
      console.log('Results:', JSON.stringify(result.data, null, 2));
      
      if (result.data.menuItems.length > 0) {
        const calculatedPrice = result.data.menuItems[0].currentPrice;
        console.log(`📊 Calculated Price: $${calculatedPrice}`);
        console.log(`📊 Expected Price: $${expectedPrice.toFixed(2)}`);
        console.log(`📊 Cart Display Price: $17.49`);
        console.log(`📊 Cart Subtotal Price: $11.99`);
        
        if (Math.abs(calculatedPrice - expectedPrice) < 0.01) {
          console.log('✅ Price calculation matches expected result');
        } else {
          console.log('❌ Price calculation mismatch!');
        }
      }
    } else {
      console.log('❌ Price refresh failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Request Error:', error.message);
  }
}

testMenuItemPricing();
