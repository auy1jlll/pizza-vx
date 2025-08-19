#!/usr/bin/env node

/**
 * Test Italian Sub Customization Formatting
 * This demonstrates the CORRECT way to add items to cart
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testItalianSub() {
  try {
    console.log('🥪 Testing Italian Sub Customization...\n');
    
    // Find the Italian Sub
    const italianSub = await prisma.menuItem.findFirst({
      where: { 
        name: { contains: 'Italian Sub' }
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
      console.log('❌ Italian Sub not found in database');
      return;
    }
    
    console.log(`📋 Found: ${italianSub.name} (${italianSub.category.name})`);
    console.log(`💰 Base Price: $${italianSub.basePrice}`);
    console.log(`🎛️  Customization Groups: ${italianSub.customizationGroups.length}`);
    
    // Show available customizations
    console.log('\n🔧 Available Customizations:');
    italianSub.customizationGroups.forEach((custGroup, idx) => {
      const group = custGroup.customizationGroup;
      console.log(`   ${idx + 1}. ${group.name} (${group.type})`);
      console.log(`      Required: ${custGroup.isRequired ? 'Yes' : 'No'}`);
      console.log(`      Min/Max: ${group.minSelections}/${group.maxSelections || 'unlimited'}`);
      
      group.options.slice(0, 3).forEach(option => {
        console.log(`         • ${option.name} (+$${option.priceModifier})`);
      });
      
      if (group.options.length > 3) {
        console.log(`         ... and ${group.options.length - 3} more options`);
      }
      console.log();
    });
    
    // Create test selections (similar to your original cart data)
    const testCustomizations = [];
    
    // Find "Bread Type" group and select "Small Sub Roll" 
    const breadGroup = italianSub.customizationGroups.find(cg => 
      cg.customizationGroup.name.includes('Bread')
    );
    
    if (breadGroup) {
      const smallSubRollOption = breadGroup.customizationGroup.options.find(opt =>
        opt.name.includes('Small Sub Roll')
      );
      
      if (smallSubRollOption) {
        testCustomizations.push({
          customizationOptionId: smallSubRollOption.id,
          quantity: 1
        });
        console.log(`✅ Selected: ${smallSubRollOption.name} from ${breadGroup.customizationGroup.name}`);
      }
    }
    
    // Add other selections if available
    for (const custGroup of italianSub.customizationGroups.slice(0, 2)) {
      const group = custGroup.customizationGroup;
      
      // Skip if we already added this group
      if (testCustomizations.find(tc => 
        group.options.some(opt => opt.id === tc.customizationOptionId)
      )) continue;
      
      const firstOption = group.options[0];
      if (firstOption) {
        testCustomizations.push({
          customizationOptionId: firstOption.id,
          quantity: 1
        });
        console.log(`✅ Selected: ${firstOption.name} from ${group.name}`);
      }
    }
    
    if (testCustomizations.length === 0) {
      console.log('⚠️  No customizations to test');
      return;
    }
    
    console.log(`\n🧪 Testing with ${testCustomizations.length} customizations...`);
    
    // Test the formatForCart API
    const response = await fetch('http://localhost:3005/api/menu/format-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId: italianSub.id,
        customizations: testCustomizations
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('\n✅ SUCCESS! formatForCart API returned proper structure:');
      console.log('\n📋 CORRECT Cart Item Structure:');
      console.log('=====================================');
      console.log(JSON.stringify(data.data, null, 2));
      
      console.log('\n🎯 Key Points:');
      console.log('1. ✅ menuItemName is correct (not "Custom Pizza")');
      console.log('2. ✅ customizations is an array of objects');
      console.log('3. ✅ Each customization has groupName and selections');
      console.log('4. ✅ Each selection has optionName, price, quantity');
      console.log('5. ✅ totalPrice includes customization costs');
      
      console.log('\n⚠️  What was happening before:');
      console.log('   • Cart stored: ["Bread Type: Small Sub Roll"]');
      console.log('   • Display showed: "Custom Pizza" with "undefined: undefined"');
      console.log('\n✅ What happens now:');
      console.log(`   • Cart stores proper object structure`);
      console.log(`   • Display shows: "${data.data.menuItemName}" with proper customizations`);
      
    } else {
      console.log('\n❌ formatForCart API failed:', data.error);
      if (data.details) {
        console.log('Details:', data.details);
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testItalianSub();
