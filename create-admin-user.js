const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();

  try {
    console.log('👑 Creating admin user...\n');

    // Admin credentials
    const adminEmail = 'admin@greenlandpizza.com';
    const adminPassword = 'admin123';
    const adminName = 'Pizza Admin';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🆔 ID: ${existingAdmin.id}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      console.log('\n🔐 To reset password, you can update it through the admin panel or database directly.');
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        emailVerified: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`👤 Role: ${adminUser.role}`);
    console.log(`📅 Created: ${adminUser.createdAt.toLocaleDateString()}`);

    console.log('\n🔑 Admin Login Credentials:');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔒 Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the password after first login!');

    console.log('\n🎯 You can now login to the admin panel at:');
    console.log('http://localhost:3005/management-portal/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
