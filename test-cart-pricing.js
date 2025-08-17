const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCartPricing() {
  try {
    // Get a sample menu item ID
    const sampleMenuItem = await prisma.menuItem.findFirst();
    
    if (!sampleMenuItem) {
      console.log('❌ No menu items found');
      return;
    }
    
    console.log(`📄 Testing with: ${sampleMenuItem.name} (ID: ${sampleMenuItem.id})`);
    
    // Test the pricing API
    const testData = {
      cartItems: [
        {
          type: 'menu',
          menuItemId: sampleMenuItem.id,
          customizations: []
        }
      ]
    };
    
    console.log('\n🔄 Testing cart pricing API...');
    
    const response = await fetch('http://localhost:3000/api/cart/prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API Error:', response.status, await response.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCartPricing();
