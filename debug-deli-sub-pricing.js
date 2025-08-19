const { PrismaClient } = require('@prisma/client');

async function debugDeliSubPricing() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 DEBUGGING DELI SUB PRICING ISSUE...\n');

    // Get the Italian Sub menu item
    const italianSub = await prisma.menuItem.findFirst({
      where: { 
        name: 'Italian Sub'
      },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (!italianSub) {
      console.log('❌ Italian Sub not found');
      return;
    }

    console.log('📋 ITALIAN SUB DETAILS:');
    console.log(`- Name: ${italianSub.name}`);
    console.log(`- Base Price: $${italianSub.basePrice}`);
    console.log(`- Category: ${italianSub.category.name}`);
    console.log('');

    console.log('🛠️ CUSTOMIZATION GROUPS:');
    italianSub.customizationGroups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.customizationGroup.name}`);
      console.log(`   - Required: ${group.customizationGroup.isRequired}`);
      console.log(`   - Type: ${group.customizationGroup.type}`);
      console.log('   Options:');
      group.customizationGroup.options.forEach(option => {
        console.log(`     - ${option.name}: +$${option.priceModifier} ${option.isDefault ? '(DEFAULT)' : ''}`);
      });
      console.log('');
    });

    // Test pricing calculation with default options
    console.log('💰 PRICING CALCULATION TEST:');
    let totalPrice = italianSub.basePrice;
    console.log(`Base price: $${totalPrice}`);

    // Find default bread option (should be Small Sub Roll)
    const breadGroup = italianSub.customizationGroups.find(g => 
      g.customizationGroup.name === 'Bread Type'
    );
    
    if (breadGroup) {
      const defaultBread = breadGroup.customizationGroup.options.find(opt => opt.isDefault);
      if (defaultBread) {
        console.log(`Default bread: ${defaultBread.name} (+$${defaultBread.priceModifier})`);
        totalPrice += defaultBread.priceModifier;
      }
    }

    console.log(`Expected total with defaults: $${totalPrice.toFixed(2)}`);

    // Test API response
    console.log('\n🌐 TESTING API RESPONSE:');
    try {
      const response = await fetch('http://localhost:3005/api/menu/deli-subs');
      if (response.ok) {
        const data = await response.json();
        const italianSubFromAPI = data.find(item => item.name === 'Italian Sub');
        if (italianSubFromAPI) {
          console.log(`API Base Price: $${italianSubFromAPI.basePrice}`);
          console.log(`API has ${italianSubFromAPI.customizationGroups?.length || 0} customization groups`);
        }
      } else {
        console.log(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`API Request failed: ${error.message}`);
    }

    // Test cart formatting
    console.log('\n🛒 TESTING CART FORMATTING:');
    const testCartItem = {
      id: italianSub.id,
      name: italianSub.name,
      basePrice: italianSub.basePrice,
      quantity: 1,
      customizations: []
    };

    try {
      const formatResponse = await fetch('http://localhost:3005/api/menu/format-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [testCartItem] })
      });
      
      if (formatResponse.ok) {
        const formatted = await formatResponse.json();
        console.log('Formatted cart item:', JSON.stringify(formatted, null, 2));
      } else {
        console.log(`Format API Error: ${formatResponse.status}`);
      }
    } catch (error) {
      console.log(`Format API Request failed: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error debugging pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Add delay to allow server to start
setTimeout(debugDeliSubPricing, 3000);
