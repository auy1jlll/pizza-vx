import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function createSampleUsers() {
  try {
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create sample customers
    const customer1 = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        password: hashedPassword,
        name: 'John Doe',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        password: hashedPassword,
        name: 'Jane Smith',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create sample employees
    const employee1 = await prisma.user.create({
      data: {
        email: 'mike.manager@example.com',
        password: hashedPassword,
        name: 'Mike Manager',
        role: 'EMPLOYEE',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create another admin user
    const admin2 = await prisma.user.create({
      data: {
        email: 'sarah.admin@example.com',
        password: hashedPassword,
        name: 'Sarah Admin',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      },
    });

    console.log('Sample users created successfully!');
    console.log('Customers:', customer1.email, customer2.email);
    console.log('Employees:', employee1.email);
    console.log('Admins:', admin2.email);
    console.log('All users have password: password123');

  } catch (error) {
    console.error('Error creating sample users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleUsers();
