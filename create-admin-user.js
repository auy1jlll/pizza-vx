const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Creating Admin User...\n');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      console.log(`📁 Admin user already exists: ${existingAdmin.email}`);
      console.log(`🔑 You can use these credentials to login:`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Password: admin123 (if you haven't changed it)`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@localhost.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n🔑 Admin Login Credentials:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔒 Password: admin123`);
    console.log('\n📍 Login at: http://localhost:3005/admin/login');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
