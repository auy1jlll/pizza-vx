const http = require('http');

// Test the employee authentication flow
async function testEmployeeAuth() {
    console.log('🧪 Testing employee authentication flow...\n');

    // Step 1: Login with employee credentials
    const loginData = JSON.stringify({
        username: 'staff101@greenlandfamous.com',
        password: 'employee123'
    });

    const loginOptions = {
        hostname: 'localhost',
        port: 3005,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };

    return new Promise((resolve) => {
        console.log('🔐 Attempting login...');
        const req = http.request(loginOptions, (res) => {
            console.log(`✅ Login Status: ${res.statusCode}`);
            
            // Extract cookies from response
            const setCookie = res.headers['set-cookie'];
            let adminToken = '';
            if (setCookie) {
                const tokenCookie = setCookie.find(cookie => cookie.startsWith('admin-token='));
                if (tokenCookie) {
                    adminToken = tokenCookie.split(';')[0];
                    console.log('🍪 Admin token cookie found');
                }
            }
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('📄 Login Response:', data);
                
                try {
                    const loginResponse = JSON.parse(data);
                    if (loginResponse.success && loginResponse.user) {
                        console.log('👤 User data:', loginResponse.user);
                        
                        // Step 2: Test auth/me endpoint with cookies
                        testAuthMe(adminToken);
                        
                        // Step 3: Test dashboard access with cookies
                        setTimeout(() => testDashboard(adminToken), 1000);
                    } else {
                        console.log('❌ Login failed - no user data');
                    }
                } catch (error) {
                    console.log('❌ Login response parsing error:', error.message);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('❌ Login request error:', error.message);
            resolve();
        });

        req.write(loginData);
        req.end();
    });
}

async function testAuthMe(adminToken) {
    console.log('\n🔍 Testing /api/auth/me endpoint...');
    
    const authOptions = {
        hostname: 'localhost',
        port: 3005,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
            'Cookie': adminToken
        }
    };

    return new Promise((resolve) => {
        const req = http.request(authOptions, (res) => {
            console.log(`✅ Auth/me Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('📄 Auth/me Response:', data);
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('❌ Auth/me request error:', error.message);
            resolve();
        });

        req.end();
    });
}

async function testDashboard(adminToken) {
    console.log('\n📊 Testing dashboard endpoint...');
    
    const dashboardOptions = {
        hostname: 'localhost',
        port: 3005,
        path: '/api/management-portal/dashboard',
        method: 'GET',
        headers: {
            'Cookie': adminToken
        }
    };

    return new Promise((resolve) => {
        const req = http.request(dashboardOptions, (res) => {
            console.log(`✅ Dashboard Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        console.log('📊 Dashboard working! Stats keys:', Object.keys(response.stats || {}));
                        console.log('🎉 EMPLOYEE AUTHENTICATION IS WORKING!');
                    } catch (e) {
                        console.log('📄 Dashboard Response (raw):', data.substring(0, 200) + '...');
                    }
                } else {
                    console.log('❌ Dashboard Response:', data);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('❌ Dashboard request error:', error.message);
            resolve();
        });

        req.end();
    });
}

testEmployeeAuth().catch(console.error);
