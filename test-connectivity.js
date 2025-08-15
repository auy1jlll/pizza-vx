// Simple server connectivity test
console.log('Testing server connectivity...');

async function testConnectivity() {
  try {
    console.log('1. Testing root endpoint...');
    const rootResponse = await fetch('http://localhost:3000/');
    console.log('Root response status:', rootResponse.status);
    
    console.log('2. Testing auth endpoint...');
    const authResponse = await fetch('http://localhost:3000/api/auth/me');
    console.log('Auth response status:', authResponse.status);
    
    console.log('3. Testing settings endpoint...');
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings');
    console.log('Settings response status:', settingsResponse.status);
    
    console.log('✅ Server is responding to basic requests');
    
  } catch (error) {
    console.error('❌ Server connectivity test failed:', error.message);
  }
}

testConnectivity();
