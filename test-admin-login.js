// Test admin login credentials
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function testAdminLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔐 Testing Admin Login Credentials...\n');
    
    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@pizzabuilder.com' }
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Has Password: ${adminUser.password ? 'Yes' : 'No'}`);
    
    // Test the password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, adminUser.password);
    
    console.log(`\n🧪 Testing password "${testPassword}"`);
    console.log(`   Password Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
    
    if (isValid) {
      console.log('\n🎉 Login credentials are correct!');
      console.log('📧 Email: admin@pizzabuilder.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('\n❌ Password verification failed!');
      console.log('⚠️  The password might have been changed or corrupted.');
      
      // Create a new password hash
      console.log('\n🔧 Creating fresh admin user...');
      const newHash = await bcrypt.hash('admin123', 10);
      
      await prisma.user.update({
        where: { email: 'admin@pizzabuilder.com' },
        data: { password: newHash }
      });
      
      console.log('✅ Admin password reset to: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
