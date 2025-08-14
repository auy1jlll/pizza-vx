const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testPasswordComparison() {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ Test user found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Has Password:', !!user.password);
    console.log('  Password Hash:', user.password ? user.password.substring(0, 30) + '...' : 'None');
    
    // Test password comparison
    const testPassword = 'password123';
    console.log('\\nTesting password comparison...');
    console.log('Test password:', testPassword);
    
    if (user.password) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Password comparison result:', isValid);
      
      if (isValid) {
        console.log('✅ Password comparison successful!');
      } else {
        console.log('❌ Password comparison failed!');
        
        // Test with a new hash
        console.log('\\nTesting with fresh hash...');
        const newHash = await bcrypt.hash(testPassword, 12);
        console.log('New hash:', newHash.substring(0, 30) + '...');
        const newComparison = await bcrypt.compare(testPassword, newHash);
        console.log('New hash comparison:', newComparison);
      }
    } else {
      console.log('❌ User has no password hash');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordComparison();
