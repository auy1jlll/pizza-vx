const fetch = require('node-fetch');

async function testCreateCustomizationOption() {
  try {
    console.log('🔍 Testing customization option creation...\n');

    // Login first
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@pizzabuilder.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    console.log('✅ Login successful');
    const cookies = loginResponse.headers.get('set-cookie');

    // Get groups first
    console.log('\n📡 Fetching customization groups...');
    const groupsResponse = await fetch('http://localhost:3005/api/admin/menu/customization-groups', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    if (!groupsResponse.ok) {
      console.log('❌ Failed to fetch groups:', groupsResponse.status);
      return;
    }

    const groups = await groupsResponse.json();
    console.log(`✅ Found ${groups.length} groups`);

    // Find "Deli Subs topping" group (exact name from the database)
    const deliSubsGroup = groups.find(group => group.name.includes('Deli Subs topping'));
    
    if (!deliSubsGroup) {
      console.log('❌ Could not find "Deli Subs topping" group');
      console.log('Available groups:', groups.map(g => g.name));
      return;
    }

    console.log(`🎯 Found "Deli Subs topping" group: ${deliSubsGroup.id}`);

    // Test creating a bread option
    console.log('\n📡 Testing POST customization option...');
    const createResponse = await fetch('http://localhost:3005/api/admin/menu/customization-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        groupId: deliSubsGroup.id,
        name: 'White Bread',
        description: 'Fresh white bread',
        priceModifier: 1,
        priceType: 'FLAT',
        isDefault: false,
        isActive: true,
        sortOrder: 0
      })
    });

    console.log(`📊 Create option status: ${createResponse.status}`);

    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Customization option created successfully');
      console.log('🆔 Option ID:', result.data.id);
      console.log('📝 Option name:', result.data.name);
      console.log('💰 Price modifier:', result.data.priceModifier);

      // Test fetching the created option
      console.log('\n📡 Testing GET single option...');
      const getOptionResponse = await fetch(`http://localhost:3005/api/admin/menu/customization-options/${result.data.id}`, {
        headers: {
          'Cookie': cookies || ''
        }
      });

      console.log(`📊 GET option status: ${getOptionResponse.status}`);

      if (getOptionResponse.ok) {
        const optionResult = await getOptionResponse.json();
        console.log('✅ Option fetched successfully');
        console.log('📝 Retrieved option:', optionResult.data.name);
        console.log('🏷️ Group:', optionResult.data.group.name);
      } else {
        console.log('❌ Failed to fetch created option');
        const errorText = await getOptionResponse.text();
        console.log('Error:', errorText);
      }

    } else {
      console.log('❌ Failed to create customization option');
      const errorText = await createResponse.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testCreateCustomizationOption();
