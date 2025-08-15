// Simple JWT Service Test
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function testJWTServiceDirectly() {
  console.log('🔐 Testing JWT Service Directly');
  console.log('=' .repeat(50));

  let passed = 0;
  let failed = 0;

  // Test 1: Import JWT Service
  console.log('\n1. Testing JWT Service import...');
  try {
    const { JWTService } = await import('./src/lib/jwt-service.ts');
    const jwtService = new JWTService();
    console.log('✅ JWT Service imported successfully');
    passed++;
    
    // Test 2: Generate token pair
    console.log('\n2. Testing token pair generation...');
    try {
      // Get admin user from database
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@pizzabuilder.com' }
      });
      
      if (!adminUser) {
        throw new Error('Admin user not found. Please run create-admin.js first.');
      }
      
      const clientInfo = {
        ipAddress: '127.0.0.1',
        userAgent: 'Test-Agent'
      };
      
      const tokenPair = await jwtService.generateTokenPair({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }, clientInfo);
      
      if (tokenPair.accessToken && tokenPair.refreshToken) {
        console.log('✅ Token pair generated successfully');
        console.log(`   Access token length: ${tokenPair.accessToken.length}`);
        console.log(`   Refresh token length: ${tokenPair.refreshToken.length}`);
        passed++;
        
        // Test 3: Verify access token
        console.log('\n3. Testing access token verification...');
        const payload = await jwtService.verifyToken(tokenPair.accessToken, 'access');
        if (payload && payload.userId === adminUser.id) {
          console.log('✅ Access token verification successful');
          passed++;
        } else {
          console.log('❌ Access token verification failed');
          failed++;
        }
        
        // Test 4: Verify refresh token
        console.log('\n4. Testing refresh token verification...');
        const refreshPayload = await jwtService.verifyToken(tokenPair.refreshToken, 'refresh');
        if (refreshPayload && refreshPayload.userId === adminUser.id) {
          console.log('✅ Refresh token verification successful');
          passed++;
        } else {
          console.log('❌ Refresh token verification failed');
          failed++;
        }
        
        // Test 5: Token refresh
        console.log('\n5. Testing token refresh...');
        const refreshResult = await jwtService.refreshAccessToken(tokenPair.refreshToken, clientInfo);
        if (refreshResult && refreshResult.accessToken) {
          console.log('✅ Token refresh successful');
          passed++;
        } else {
          console.log('❌ Token refresh failed');
          failed++;
        }
        
        // Test 6: Token blacklisting
        console.log('\n6. Testing token blacklisting...');
        await jwtService.blacklistToken(tokenPair.accessToken, 'TEST');
        const blacklistedPayload = await jwtService.verifyToken(tokenPair.accessToken, 'access');
        if (!blacklistedPayload) {
          console.log('✅ Token blacklisting successful');
          passed++;
        } else {
          console.log('❌ Token blacklisting failed');
          failed++;
        }
        
      } else {
        console.log('❌ Token pair generation failed');
        failed++;
      }
    } catch (error) {
      console.log('❌ Token pair generation error:', error.message);
      failed++;
    }
    
  } catch (error) {
    console.log('❌ JWT Service import failed:', error.message);
    failed++;
  }

  // Test 7: Database tables
  console.log('\n7. Testing database tables...');
  try {
    const refreshTokens = await prisma.$queryRaw`SELECT COUNT(*) as count FROM refresh_tokens`;
    const blacklist = await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_blacklist`;
    const secrets = await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_secrets`;
    
    console.log(`✅ Database tables accessible`);
    console.log(`   Refresh tokens: ${refreshTokens[0].count}`);
    console.log(`   Blacklisted tokens: ${blacklist[0].count}`);
    console.log(`   JWT secrets: ${secrets[0].count}`);
    passed++;
  } catch (error) {
    console.log('❌ Database tables test failed:', error.message);
    failed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎯 Direct JWT Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 JWT Service working correctly!');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed.');
    return false;
  }
}

testJWTServiceDirectly()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
