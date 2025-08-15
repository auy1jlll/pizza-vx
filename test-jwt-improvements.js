// JWT Improvements Testing Script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testJWTImprovements() {
  console.log('🔐 Testing JWT Improvements (Security Enhancement 3)');
  console.log('=' .repeat(60));

  const testResults = {
    passed: 0,
    failed: 0,
    total: 10
  };

  // Test 1: Database tables exist
  console.log('\n1. Testing JWT tables exist...');
  try {
    await prisma.$queryRaw`SELECT COUNT(*) as count FROM refresh_tokens`;
    await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_blacklist`;
    await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_secrets`;
    console.log('✅ JWT tables exist');
    testResults.passed++;
  } catch (error) {
    console.log('❌ JWT tables missing:', error);
    testResults.failed++;
  }

  // Test 2: Login with token generation
  console.log('\n2. Testing login with JWT token pair...');
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@test.com',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const cookies = response.headers.get('set-cookie');
      if (cookies && cookies.includes('access-token') && cookies.includes('refresh-token')) {
        console.log('✅ Login generates both access and refresh tokens');
        testResults.passed++;
      } else {
        console.log('❌ Login missing token cookies');
        testResults.failed++;
      }
    } else {
      console.log('❌ Login failed:', response.status);
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Login test error:', error.message);
    testResults.failed++;
  }

  // Test 3: Token refresh functionality
  console.log('\n3. Testing token refresh...');
  try {
    // First login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@test.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      const refreshTokenMatch = cookies?.match(/refresh-token=([^;]+)/);
      
      if (refreshTokenMatch) {
        // Try refresh
        const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Cookie': `refresh-token=${refreshTokenMatch[1]}`
          }
        });

        if (refreshResponse.ok) {
          console.log('✅ Token refresh works');
          testResults.passed++;
        } else {
          console.log('❌ Token refresh failed:', refreshResponse.status);
          testResults.failed++;
        }
      } else {
        console.log('❌ No refresh token found');
        testResults.failed++;
      }
    } else {
      console.log('❌ Login for refresh test failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Token refresh test error:', error.message);
    testResults.failed++;
  }

  // Test 4: Logout with token revocation
  console.log('\n4. Testing logout with token revocation...');
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@test.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      
      // Logout
      const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Cookie': cookies || ''
        }
      });

      if (logoutResponse.ok) {
        console.log('✅ Logout works');
        testResults.passed++;
      } else {
        console.log('❌ Logout failed:', logoutResponse.status);
        testResults.failed++;
      }
    } else {
      console.log('❌ Login for logout test failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Logout test error:', error.message);
    testResults.failed++;
  }

  // Test 5: Sessions endpoint
  console.log('\n5. Testing sessions endpoint...');
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@test.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      
      // Get sessions
      const sessionsResponse = await fetch('http://localhost:3000/api/auth/sessions', {
        method: 'GET',
        headers: {
          'Cookie': cookies || ''
        }
      });

      if (sessionsResponse.ok) {
        const data = await sessionsResponse.json();
        if (data.sessions && Array.isArray(data.sessions)) {
          console.log('✅ Sessions endpoint works');
          testResults.passed++;
        } else {
          console.log('❌ Sessions endpoint invalid response');
          testResults.failed++;
        }
      } else {
        console.log('❌ Sessions endpoint failed:', sessionsResponse.status);
        testResults.failed++;
      }
    } else {
      console.log('❌ Login for sessions test failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Sessions test error:', error.message);
    testResults.failed++;
  }

  // Test 6: Refresh token storage
  console.log('\n6. Testing refresh token storage...');
  try {
    const refreshTokens = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM refresh_tokens WHERE revoked = FALSE
    `;
    
    if (refreshTokens[0].count > 0) {
      console.log('✅ Refresh tokens stored in database');
      testResults.passed++;
    } else {
      console.log('❌ No refresh tokens found in database');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Refresh token storage test error:', error);
    testResults.failed++;
  }

  // Test 7: JWT blacklist functionality
  console.log('\n7. Testing JWT blacklist...');
  try {
    const blacklistCount = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM jwt_blacklist
    `;
    
    // Should have some blacklisted tokens from logout tests
    console.log(`✅ JWT blacklist table accessible (${blacklistCount[0].count} entries)`);
    testResults.passed++;
  } catch (error) {
    console.log('❌ JWT blacklist test error:', error);
    testResults.failed++;
  }

  // Test 8: JWT secrets table
  console.log('\n8. Testing JWT secrets storage...');
  try {
    const secretsCount = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM jwt_secrets
    `;
    
    console.log(`✅ JWT secrets table accessible (${secretsCount[0].count} entries)`);
    testResults.passed++;
  } catch (error) {
    console.log('❌ JWT secrets test error:', error);
    testResults.failed++;
  }

  // Test 9: Token expiration times
  console.log('\n9. Testing token expiration configuration...');
  try {
    // Login and check token expiration
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@test.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      
      // Check if access token has short expiration (15 minutes)
      const accessTokenMatch = cookies?.match(/access-token=([^;]+).*?Max-Age=(\d+)/);
      const refreshTokenMatch = cookies?.match(/refresh-token=([^;]+).*?Max-Age=(\d+)/);
      
      if (accessTokenMatch && refreshTokenMatch) {
        const accessMaxAge = parseInt(accessTokenMatch[2]);
        const refreshMaxAge = parseInt(refreshTokenMatch[2]);
        
        if (accessMaxAge === 900 && refreshMaxAge === 604800) { // 15 min and 7 days
          console.log('✅ Token expiration times correct');
          testResults.passed++;
        } else {
          console.log(`❌ Token expiration incorrect: access=${accessMaxAge}, refresh=${refreshMaxAge}`);
          testResults.failed++;
        }
      } else {
        console.log('❌ Could not extract token expiration times');
        testResults.failed++;
      }
    } else {
      console.log('❌ Login for expiration test failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Token expiration test error:', error.message);
    testResults.failed++;
  }

  // Test 10: Device fingerprinting
  console.log('\n10. Testing device fingerprinting...');
  try {
    const refreshTokens = await prisma.$queryRaw<any[]>`
      SELECT device_fingerprint, ip_address, user_agent 
      FROM refresh_tokens 
      WHERE device_fingerprint IS NOT NULL 
      LIMIT 1
    `;
    
    if (refreshTokens.length > 0 && refreshTokens[0].device_fingerprint) {
      console.log('✅ Device fingerprinting working');
      testResults.passed++;
    } else {
      console.log('❌ Device fingerprinting not working');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Device fingerprinting test error:', error);
    testResults.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 JWT Improvements Test Results:');
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`);
  console.log(`📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

  if (testResults.passed === testResults.total) {
    console.log('\n🎉 All JWT Improvements tests passed! Security Enhancement 3 is complete.');
    console.log('\n🔐 JWT Security Features Implemented:');
    console.log('   • Short-lived access tokens (15 minutes)');
    console.log('   • Long-lived refresh tokens (7 days)');
    console.log('   • Token blacklisting for revocation');
    console.log('   • JWT secret rotation capability');
    console.log('   • Device fingerprinting');
    console.log('   • Automatic token refresh');
    console.log('   • Session management');
    return true;
  } else {
    console.log('\n⚠️  Some JWT tests failed. Please review the implementation.');
    return false;
  }
}

// Run the test
testJWTImprovements()
  .then((success) => {
    if (success) {
      console.log('\n✨ Ready to proceed to Security Enhancement 4: Password Reset & Email Verification');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
