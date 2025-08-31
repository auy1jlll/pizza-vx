const https = require('https');
const http = require('http');

// Test the full authentication flow
async function testAuth() {
    console.log('Testing full authentication flow...\n');

    // Step 1: Login
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
        const req = http.request(loginOptions, (res) => {
            console.log(`Login Status: ${res.statusCode}`);
            console.log('Login Headers:', res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Login Response:', data);
                
                try {
                    const loginResponse = JSON.parse(data);
                    if (loginResponse.token) {
                        console.log('\n✅ Login successful, got token');
                        
                        // Step 2: Test dashboard access with token
                        testDashboard(loginResponse.token);
                    } else {
                        console.log('\n❌ Login failed - no token received');
                    }
                } catch (error) {
                    console.log('\n❌ Login response parsing error:', error.message);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('Login request error:', error.message);
            resolve();
        });

        req.write(loginData);
        req.end();
    });
}

async function testDashboard(token) {
    console.log('\nTesting dashboard access with token...');
    
    const dashboardOptions = {
        hostname: 'localhost',
        port: 3005,
        path: '/api/management-portal/dashboard',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve) => {
        const req = http.request(dashboardOptions, (res) => {
            console.log(`Dashboard Status: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Dashboard Response:', data);
                
                if (res.statusCode === 200) {
                    console.log('\n✅ Dashboard access successful');
                } else {
                    console.log('\n❌ Dashboard access failed');
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log('Dashboard request error:', error.message);
            resolve();
        });

        req.end();
    });
}

testAuth().catch(console.error);
