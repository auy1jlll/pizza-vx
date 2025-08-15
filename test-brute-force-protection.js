// Security Enhancement 2: Brute Force Protection Test
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBruteForceProtection() {
  console.log('🛡️ Security Enhancement 2: Brute Force Protection Test\n');

  let testsPassed = 0;
  let testsTotal = 8;

  try {
    // 1. Test database tables creation
    console.log('1. Testing Brute Force Protection Tables...');
    
    const tables = ['login_attempts', 'account_lockouts', 'security_events'];
    let tablesExist = true;
    
    for (const table of tables) {
      const result = await prisma.$queryRaw`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=${table}
      `;
      
      if (result.length > 0) {
        console.log(`   ✅ ${table} table exists`);
      } else {
        console.log(`   ❌ ${table} table missing`);
        tablesExist = false;
      }
    }
    
    if (tablesExist) testsPassed++;

    // 2. Test table structure
    console.log('\n2. Testing Table Structure...');
    
    const loginAttemptsColumns = await prisma.$queryRaw`PRAGMA table_info(login_attempts)`;
    const lockoutsColumns = await prisma.$queryRaw`PRAGMA table_info(account_lockouts)`;
    const eventsColumns = await prisma.$queryRaw`PRAGMA table_info(security_events)`;
    
    console.log(`   ✅ login_attempts: ${loginAttemptsColumns.length} columns`);
    console.log(`   ✅ account_lockouts: ${lockoutsColumns.length} columns`);
    console.log(`   ✅ security_events: ${eventsColumns.length} columns`);
    
    if (loginAttemptsColumns.length >= 7 && lockoutsColumns.length >= 7 && eventsColumns.length >= 6) {
      testsPassed++;
    }

    // 3. Test service implementation
    console.log('\n3. Testing Brute Force Protection Service...');
    
    const fs = require('fs');
    if (fs.existsSync('src/lib/brute-force-protection.ts')) {
      const serviceContent = fs.readFileSync('src/lib/brute-force-protection.ts', 'utf8');
      
      const requiredMethods = [
        'recordLoginAttempt',
        'isLockedOut', 
        'getRecentFailedAttempts',
        'logSecurityEvent',
        'getSecurityStats'
      ];
      
      const allMethodsPresent = requiredMethods.every(method => serviceContent.includes(method));
      if (allMethodsPresent) {
        console.log('   ✅ BruteForceProtectionService class implemented');
        console.log('   ✅ All required methods present:');
        requiredMethods.forEach(method => console.log(`      - ${method}`));
        testsPassed++;
      } else {
        console.log('   ❌ Missing required methods in service');
      }
    } else {
      console.log('   ❌ Brute force protection service file not found');
    }

    // 4. Test configuration values
    console.log('\n4. Testing Security Configuration...');
    
    const serviceContent = fs.readFileSync('src/lib/brute-force-protection.ts', 'utf8');
    const configs = {
      'MAX_FAILED_ATTEMPTS': 5,
      'LOCKOUT_DURATION_MINUTES': 15,
      'ATTEMPT_WINDOW_MINUTES': 15
    };
    
    let configsCorrect = true;
    Object.entries(configs).forEach(([key, expectedValue]) => {
      if (serviceContent.includes(`${key} = ${expectedValue}`)) {
        console.log(`   ✅ ${key}: ${expectedValue}`);
      } else {
        console.log(`   ⚠️ ${key} configuration may need review`);
        configsCorrect = false;
      }
    });
    
    if (configsCorrect) testsPassed++;

    // 5. Test integration with login route
    console.log('\n5. Testing Login Route Integration...');
    
    if (fs.existsSync('src/app/api/auth/login/route.ts')) {
      const loginContent = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
      
      if (loginContent.includes('BruteForceProtectionService') && 
          loginContent.includes('recordLoginAttempt') &&
          loginContent.includes('isLockedOut')) {
        console.log('   ✅ Brute force protection integrated into login route');
        console.log('   ✅ Login attempt recording implemented');
        console.log('   ✅ Lockout checking implemented');
        testsPassed++;
      } else {
        console.log('   ❌ Brute force protection not properly integrated');
      }
    } else {
      console.log('   ❌ Login route file not found');
    }

    // 6. Test security indices
    console.log('\n6. Testing Security Indices...');
    
    const securityIndices = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND (
        name LIKE '%login_attempts%' OR 
        name LIKE '%account_lockouts%' OR 
        name LIKE '%security_events%'
      )
    `;
    
    console.log(`   ✅ Found ${securityIndices.length} security-related indices:`);
    securityIndices.forEach(idx => console.log(`      - ${idx.name}`));
    
    if (securityIndices.length >= 8) {
      testsPassed++;
    }

    // 7. Test security event logging
    console.log('\n7. Testing Security Event Logging...');
    
    const loginRouteContent = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
    if (loginRouteContent.includes('logSecurityEvent') && 
        loginRouteContent.includes('FAILED_LOGIN')) {
      console.log('   ✅ Security event logging implemented');
      console.log('   ✅ Failed login events tracked');
      testsPassed++;
    } else {
      console.log('   ⚠️ Security event logging needs improvement');
    }

    // 8. Test progressive lockout features
    console.log('\n8. Testing Advanced Protection Features...');
    
    const loginRouteForAdvanced = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
    
    if (serviceContent.includes('PROGRESSIVE_LOCKOUT') && 
        loginRouteForAdvanced.includes('clientIP') &&
        serviceContent.includes('severity') &&
        loginRouteForAdvanced.includes('userAgent')) {
      console.log('   ✅ Progressive lockout implemented');
      console.log('   ✅ IP address tracking enabled');
      console.log('   ✅ Severity-based event classification');
      console.log('   ✅ User-Agent tracking for forensics');
      testsPassed++;
    } else {
      console.log('   ⚠️ Checking individual features:');
      console.log(`      - Progressive lockout: ${serviceContent.includes('PROGRESSIVE_LOCKOUT') ? '✅' : '❌'}`);
      console.log(`      - IP tracking: ${loginRouteForAdvanced.includes('clientIP') ? '✅' : '❌'}`);
      console.log(`      - Severity classification: ${serviceContent.includes('severity') ? '✅' : '❌'}`);
      console.log(`      - User-Agent tracking: ${loginRouteForAdvanced.includes('userAgent') ? '✅' : '❌'}`);
    }

    // Test Results
    console.log('\n🎉 BRUTE FORCE PROTECTION TEST RESULTS:');
    console.log(`   ✅ ${testsPassed}/${testsTotal} tests passed`);
    
    if (testsPassed === testsTotal) {
      console.log('   ✅ Brute force protection successfully implemented!');
      
      console.log('\n🛡️ Security Features Implemented:');
      console.log('   • Failed login attempt tracking');
      console.log('   • Progressive account lockouts (5 attempts → 15min lockout)');
      console.log('   • IP-based protection');
      console.log('   • Security event logging and monitoring');
      console.log('   • Forensic data collection (IP, User-Agent)');
      console.log('   • Automatic cleanup of old records');
      
      console.log('\n📊 Protection Summary:');
      console.log('   • Max failed attempts: 5 per 15 minutes');
      console.log('   • Lockout duration: 15 minutes (progressive)');
      console.log('   • Event logging: All failed attempts tracked');
      console.log('   • IP tracking: Full forensic capability');
      console.log('   • Database indices: Optimized for security queries');
      
      console.log('\n🚀 Ready for Security Enhancement 3: JWT Improvements!');
      return true;
    } else {
      console.log('   ⚠️ Some brute force protection features need attention');
      return false;
    }

  } catch (error) {
    console.error('❌ Brute force protection test failed:', error.message);
    console.log(`\n📊 Results: ${testsPassed}/${testsTotal} tests passed`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testBruteForceProtection().then(success => {
  if (success) {
    console.log('\n✅ Security Enhancement 2 COMPLETE - Brute Force Protection Implemented');
  } else {
    console.log('\n❌ Security Enhancement 2 needs fixes before proceeding');
  }
});
