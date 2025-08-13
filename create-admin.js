const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Delete existing admin user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'admin@pizzabuilder.com'
      }
    });
    
    // Create new admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@pizzabuilder.com',
        name: 'Pizza Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@pizzabuilder.com');
    console.log('🔑 Password: admin123');
    console.log('👤 User ID:', adminUser.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
