const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuthentication() {
  try {
    console.log('🔄 Testing authentication system...\n');
    
    // 1. Create test customer if not exists
    console.log('1️⃣ Creating test customer...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: 'Test Customer',
          email: 'test@example.com',
          password: hashedPassword,
          role: 'CUSTOMER'
        }
      });
      console.log('✅ Test customer created successfully');
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⚠️  Test customer already exists, finding existing user...');
        user = await prisma.user.findUnique({
          where: { email: 'test@example.com' }
        });
      } else {
        throw error;
      }
    }
    
    console.log(`👤 User: ${user.name} (${user.email}) - Role: ${user.role}\n`);
    
    // 2. Test customer login endpoint
    console.log('2️⃣ Testing customer login endpoint...');
    const loginResponse = await fetch('http://localhost:3005/api/auth/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies set:', cookies);
      
      // 3. Test /api/auth/me endpoint with the cookie
      console.log('\n3️⃣ Testing /api/auth/me endpoint...');
      const meResponse = await fetch('http://localhost:3005/api/auth/me', {
        headers: {
          'Cookie': cookies || ''
        }
      });
      
      console.log(`/api/auth/me response status: ${meResponse.status}`);
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        console.log('✅ Authentication verified:', userData);
      } else {
        const errorData = await meResponse.text();
        console.log('❌ Authentication failed:', errorData);
      }
      
    } else {
      const errorData = await loginResponse.text();
      console.log('❌ Login failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAuthentication().catch(console.error);
