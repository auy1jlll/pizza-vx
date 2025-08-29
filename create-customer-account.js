const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createCustomerAccount() {
  try {
    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: 'auy1jll@gmail.com' }
    });

    if (existingCustomer) {
      console.log('✅ Customer account already exists:', existingCustomer.email);
      console.log('Customer ID:', existingCustomer.id);
      console.log('Name:', existingCustomer.name);
      return;
    }

    // Hash a temporary password
    const tempPassword = 'TempPass123!';
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create customer account
    const customer = await prisma.customer.create({
      data: {
        email: 'auy1jll@gmail.com',
        name: 'Admin User',
        password: hashedPassword,
        phone: '+1234567890'
      }
    });

    console.log('🎉 Customer account created successfully!');
    console.log('Email:', customer.email);
    console.log('Name:', customer.name);
    console.log('Customer ID:', customer.id);
    console.log('Temporary Password:', tempPassword);
    console.log('');
    console.log('✨ You can now test the forgot password functionality!');
    console.log('🔗 Go to: http://91.99.194.255:8000/auth/forgot-password');
    console.log('📧 Enter: auy1jll@gmail.com');

  } catch (error) {
    console.error('❌ Error creating customer account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomerAccount();
