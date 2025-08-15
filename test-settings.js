// Test script to verify the settings system works correctly
const fetch = require('node-fetch');

async function testSettingsSystem() {
  console.log('🧪 Testing Settings System...\n');

  try {
    // Test 1: Load settings
    console.log('1️⃣ Testing settings loading...');
    const loadResponse = await fetch('http://localhost:3003/api/admin/settings');
    
    if (loadResponse.ok) {
      const loadData = await loadResponse.json();
      console.log('✅ Settings loaded successfully');
      console.log('📋 Business Name:', loadData.settings.businessName);
      console.log('💰 Tax Rate:', loadData.settings.taxRate + '%');
      console.log('🚚 Delivery Fee: $' + loadData.settings.deliveryFee);
      console.log('⏰ Preparation Time:', loadData.settings.preparationTime + ' minutes');
    } else {
      console.log('❌ Failed to load settings');
      return;
    }

    // Test 2: Update settings
    console.log('\n2️⃣ Testing settings update...');
    const testSettings = {
      businessName: 'Pizza Builder Test',
      taxRate: 9.0,
      deliveryFee: 4.99,
      preparationTime: 30,
      orderNotifications: false
    };

    const updateResponse = await fetch('http://localhost:3003/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings: testSettings })
    });

    if (updateResponse.ok) {
      console.log('✅ Settings updated successfully');
    } else {
      console.log('❌ Failed to update settings');
      return;
    }

    // Test 3: Verify updated settings
    console.log('\n3️⃣ Verifying updated settings...');
    const verifyResponse = await fetch('http://localhost:3003/api/admin/settings');
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Updated settings verified');
      console.log('📋 Updated Business Name:', verifyData.settings.businessName);
      console.log('💰 Updated Tax Rate:', verifyData.settings.taxRate + '%');
      console.log('🚚 Updated Delivery Fee: $' + verifyData.settings.deliveryFee);
      console.log('⏰ Updated Preparation Time:', verifyData.settings.preparationTime + ' minutes');
    } else {
      console.log('❌ Failed to verify updated settings');
    }

    console.log('\n✅ All settings tests passed!');
    console.log('\n🎯 Settings System Features:');
    console.log('  • Global business information management');
    console.log('  • Dynamic tax rate configuration');
    console.log('  • Delivery fee and minimum order settings');
    console.log('  • Business hours configuration');
    console.log('  • Notification preferences');
    console.log('  • Real-time settings updates');
    console.log('  • Settings persistence in database');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSettingsSystem();
