const http = require('http');

async function testCurrentUser() {
    console.log('🔍 Testing current user session...\n');

    // Test the /api/auth/me endpoint to see current user
    const options = {
        hostname: 'localhost',
        port: 3005,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
            'Cookie': 'admin-token=; access-token=;' // Let it use any existing cookies
        }
    };

    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            console.log(`Auth Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Current User Response:', data);
                
                if (res.statusCode === 200) {
                    try {
                        const userInfo = JSON.parse(data);
                        console.log('\n✅ Current User Info:');
                        console.log('- Role:', userInfo.user?.role);
                        console.log('- Email:', userInfo.user?.email);
                        console.log('- Name:', userInfo.user?.name);
                    } catch (e) {
                        console.log('Error parsing user data:', e.message);
                    }
                } else {
                    console.log('\n❌ No active session or authentication failed');
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('❌ Request error:', error.message);
            resolve();
        });

        req.end();
    });
}

testCurrentUser().catch(console.error);
