const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { email: 'auy1jll@gmail.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    // Test password
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('Password valid:', isValid);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
