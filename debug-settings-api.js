const fetch = require('node-fetch');

async function checkSettingsAPI() {
  try {
    console.log('Checking settings API response...');
    
    const response = await fetch('http://localhost:3005/api/admin/settings');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const data = await response.json();
    console.log('Response data type:', typeof data);
    console.log('Response data:', data);
    
    if (Array.isArray(data)) {
      console.log('Data is an array with', data.length, 'items');
    } else {
      console.log('Data structure:', Object.keys(data));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSettingsAPI();
