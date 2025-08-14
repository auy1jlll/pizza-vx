const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createTestCustomer() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create test customer
    const user = await prisma.user.create({
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'CUSTOMER'
      }
    });
    
    console.log('✅ Test customer created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('👤 Name: Test Customer');
    console.log('🆔 User ID:', user.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Test customer already exists with email: test@example.com');
    } else {
      console.error('❌ Error creating test customer:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestCustomer();
