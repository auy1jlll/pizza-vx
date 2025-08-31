import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
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

    return Response.json({
      success: true,
      message: 'Sample users created',
      users: [
        { email: customer1.email, role: customer1.role },
        { email: customer2.email, role: customer2.role },
        { email: employee1.email, role: employee1.role },
        { email: admin2.email, role: admin2.role },
      ]
    });

  } catch (error) {
    console.error('Error creating sample users:', error);
    return Response.json({ error: 'Failed to create users' }, { status: 500 });
  }
}
