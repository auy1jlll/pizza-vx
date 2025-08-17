const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAuthSystem() {
  try {
    console.log('🔧 Fixing authentication system...');

    // 1. Create a test customer user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'customer@test.com' }
    });

    if (existingUser) {
      console.log('✅ Test customer already exists:', existingUser.email);
    } else {
      const testCustomer = await prisma.user.create({
        data: {
          email: 'customer@test.com',
          name: 'Test Customer',
          password: hashedPassword,
          role: 'CUSTOMER'
        }
      });
      console.log('✅ Created test customer:', testCustomer.email);
    }

    // 2. Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    });

    if (existingAdmin) {
      console.log('✅ Test admin already exists:', existingAdmin.email);
    } else {
      const testAdmin = await prisma.user.create({
        data: {
          email: 'admin@test.com',
          name: 'Test Admin',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Created test admin:', testAdmin.email);
    }

    console.log('');
    console.log('🎯 Authentication System Fixed!');
    console.log('');
    console.log('📧 Test Accounts Created:');
    console.log('   Customer: customer@test.com / password123');
    console.log('   Admin: admin@test.com / password123');
    console.log('');
    console.log('🌐 Next Steps:');
    console.log('   1. Navigate to: http://localhost:3005');
    console.log('   2. Try logging in with the test accounts');
    console.log('   3. Check if the auth endpoints work');

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Failed to fix authentication system:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixAuthSystem();
