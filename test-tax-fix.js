const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTaxCalculationFix() {
  try {
    console.log('🧪 Testing Tax Rate Fix');
    console.log('=====================\n');

    // Test the cart refresh API endpoint to see if tax calculation is fixed
    const testData = {
      items: [{
        id: 'test-pizza',
        type: 'pizza',
        size: {
          id: 'test-size',
          name: 'Extra Large',
          basePrice: 34.49
        },
        crust: {
          id: 'test-crust',
          name: 'Stuffed Crust',
          priceModifier: 0
        },
        sauce: {
          id: 'test-sauce',
          name: 'Original Pizza Sauce',
          priceModifier: 0
        },
        toppings: [
          { name: 'EXTRA CHEESE', price: 0 },
          { name: 'Extra Cheese', price: 0 },
          { name: 'Feta Cheese', price: 0 },
          { name: 'Goat Cheese', price: 0 }
        ],
        quantity: 1,
        totalPrice: 34.49
      }]
    };

    console.log('📊 Test Calculation:');
    console.log('Subtotal: $34.49');
    
    // Test different tax rates
    const subtotal = 34.49;
    const oldTaxRate = 0.08875; // 8.875% (the old hardcoded rate)
    const newTaxRate = 0.0825;  // 8.25% (the correct database rate)
    
    const oldTax = +(subtotal * oldTaxRate).toFixed(2);
    const newTax = +(subtotal * newTaxRate).toFixed(2);
    
    console.log(`Old Tax Rate (8.875%): $${oldTax}`);
    console.log(`New Tax Rate (8.25%): $${newTax}`);
    console.log(`Difference: $${(oldTax - newTax).toFixed(2)}\n`);
    
    // Test with actual API call
    console.log('🌐 Testing API Response...');
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response:', JSON.stringify(result, null, 2));
      
      if (result.tax) {
        const apiTaxRate = (result.tax / result.subtotal * 100).toFixed(2);
        console.log(`\n📈 Calculated Tax Rate from API: ${apiTaxRate}%`);
        
        if (apiTaxRate === '8.25') {
          console.log('✅ Tax rate is correctly using 8.25%!');
        } else {
          console.log('❌ Tax rate is still incorrect');
        }
      }
    } else {
      console.log('❌ API call failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testTaxCalculationFix();
