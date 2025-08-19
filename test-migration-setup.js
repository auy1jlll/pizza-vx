#!/usr/bin/env node

console.log('🧪 Testing Customization Migration Setup...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSetup() {
  try {
    console.log('1. Testing database connection...');
    const itemCount = await prisma.menuItem.count();
    console.log(`   ✅ Database connected. Found ${itemCount} menu items.`);
    
    console.log('2. Testing customization groups...');
    const customizationCount = await prisma.customizationGroup.count();
    console.log(`   ✅ Found ${customizationCount} customization groups.`);
    
    console.log('3. Testing menu items with customizations...');
    const itemsWithCustomizations = await prisma.menuItem.findMany({
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
      },
      where: {
        customizationGroups: {
          some: {}
        }
      }
    });
    
    console.log(`   ✅ Found ${itemsWithCustomizations.length} items with customizations:`);
    
    itemsWithCustomizations.slice(0, 5).forEach(item => {
      console.log(`      • ${item.name} (${item.category.name}): ${item.customizationGroups.length} groups`);
    });
    
    if (itemsWithCustomizations.length > 5) {
      console.log(`      ... and ${itemsWithCustomizations.length - 5} more`);
    }
    
    console.log('4. Testing API endpoint...');
    const testResponse = await fetch('http://localhost:3005/api/menu/format-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId: 'invalid-id',
        customizations: []
      })
    });
    
    const testData = await testResponse.json();
    console.log(`   ✅ API endpoint responds: ${testData.success ? 'SUCCESS' : 'ERROR (expected for invalid ID)'}`);
    
    console.log('\n🎯 Ready to test specific menu item...');
    
    // Test the first item with customizations
    if (itemsWithCustomizations.length > 0) {
      const testItem = itemsWithCustomizations[0];
      console.log(`\n🔬 Testing: ${testItem.name}`);
      
      // Create a simple test customization
      const testCustomizations = [];
      
      for (const custGroup of testItem.customizationGroups.slice(0, 1)) { // Just test first group
        const group = custGroup.customizationGroup;
        const firstOption = group.options[0];
        
        if (firstOption) {
          testCustomizations.push({
            customizationOptionId: firstOption.id,
            quantity: 1
          });
          console.log(`   Adding test option: ${firstOption.name} from group: ${group.name}`);
        }
      }
      
      if (testCustomizations.length > 0) {
        console.log('\n📡 Testing formatForCart API...');
        const response = await fetch('http://localhost:3005/api/menu/format-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            menuItemId: testItem.id,
            customizations: testCustomizations
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('   ✅ formatForCart API works!');
          console.log('\n📋 Expected customization structure:');
          console.log(JSON.stringify(data.data.customizations, null, 4));
          
          console.log('\n✨ This is the CORRECT format that should be stored in cart!');
        } else {
          console.log('   ❌ formatForCart API failed:', data.error);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSetup();
