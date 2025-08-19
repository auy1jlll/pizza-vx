console.log('🔍 Testing settings API directly...');

fetch('http://localhost:3005/api/admin/settings')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Response:', data);
    
    const appNameSetting = data.find(setting => setting.key === 'app_name');
    if (appNameSetting) {
      console.log(`🏷️  App Name in DB: "${appNameSetting.value}"`);
    } else {
      console.log('❌ No app_name setting found!');
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
