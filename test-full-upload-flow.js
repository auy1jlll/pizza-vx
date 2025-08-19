const fetch = require('node-fetch');
const FormData = require('form-data');

async function testFullUploadFlow() {
  try {
    console.log('=== Testing Full Upload and Save Flow ===\n');
    
    // Step 1: Test upload
    console.log('1. Testing image upload...');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const form = new FormData();
    form.append('file', testImageBuffer, {
      filename: 'test-logo.png',
      contentType: 'image/png'
    });
    form.append('type', 'logo');
    
    const uploadResponse = await fetch('http://localhost:3005/api/upload/image', {
      method: 'POST',
      body: form
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload successful:', uploadData);
    
    // Step 2: Test getting current settings
    console.log('\n2. Getting current settings...');
    const settingsResponse = await fetch('http://localhost:3005/api/admin/settings');
    
    if (!settingsResponse.ok) {
      throw new Error(`Settings fetch failed: ${settingsResponse.status}`);
    }
    
    const settings = await settingsResponse.json();
    console.log('✅ Settings fetched:', settings.length, 'settings found');
    
    // Find logo setting
    const logoSetting = settings.find(s => s.key === 'appLogoUrl');
    console.log('Current logo setting:', logoSetting);
    
    // Step 3: Test updating the logo setting
    console.log('\n3. Testing settings update...');
    const updateData = {
      appLogoUrl: uploadData.url
    };
    
    const updateResponse = await fetch('http://localhost:3005/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Settings update failed: ${updateResponse.status} - ${errorText}`);
    }
    
    const updateResult = await updateResponse.json();
    console.log('✅ Settings update result:', updateResult);
    
    // Step 4: Verify the update
    console.log('\n4. Verifying update...');
    const verifyResponse = await fetch('http://localhost:3005/api/admin/settings');
    const verifySettings = await verifyResponse.json();
    const updatedLogoSetting = verifySettings.find(s => s.key === 'appLogoUrl');
    
    console.log('Updated logo setting:', updatedLogoSetting);
    
    if (updatedLogoSetting && updatedLogoSetting.value === uploadData.url) {
      console.log('🎉 SUCCESS: Logo URL saved successfully!');
    } else {
      console.log('❌ FAILED: Logo URL was not saved properly');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullUploadFlow();
