const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('Creating test users...\n');

    // Create test customers
    const customers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          loyaltyPoints: 250,
          totalOrders: 5
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1987654321',
          loyaltyPoints: 150,
          totalOrders: 3
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: 'password123',
        profile: {
          firstName: 'Mike',
          lastName: 'Johnson',
          phone: '+1555123456',
          loyaltyPoints: 50,
          totalOrders: 1
        }
      }
    ];

    // Create test employees
    const employees = [
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@pizzabuilder.com',
        password: 'password123',
        role: 'EMPLOYEE',
        profile: {
          employeeId: 'EMP001',
          firstName: 'Sarah',
          lastName: 'Wilson',
          position: 'Kitchen Staff',
          department: 'Kitchen',
          hourlyWage: 15.50,
          permissions: ['MANAGE_ORDERS', 'VIEW_KITCHEN'],
          isActive: true
        }
      },
      {
        name: 'Tom Garcia',
        email: 'tom.garcia@pizzabuilder.com',
        password: 'password123',
        role: 'EMPLOYEE',
        profile: {
          employeeId: 'EMP002',
          firstName: 'Tom',
          lastName: 'Garcia',
          position: 'Delivery Driver',
          department: 'Delivery',
          hourlyWage: 12.00,
          permissions: ['VIEW_ORDERS', 'UPDATE_DELIVERY_STATUS'],
          isActive: true
        }
      }
    ];

    // Create customers
    for (const customerData of customers) {
      const hashedPassword = await bcrypt.hash(customerData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          name: customerData.name,
          email: customerData.email,
          password: hashedPassword,
          role: 'CUSTOMER',
          customerProfile: {
            create: customerData.profile
          }
        },
        include: {
          customerProfile: true
        }
      });
      
      console.log(`✅ Created customer: ${user.name} (${user.email})`);
    }

    // Create employees
    for (const employeeData of employees) {
      const hashedPassword = await bcrypt.hash(employeeData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          name: employeeData.name,
          email: employeeData.email,
          password: hashedPassword,
          role: employeeData.role,
          employeeProfile: {
            create: employeeData.profile
          }
        },
        include: {
          employeeProfile: true
        }
      });
      
      console.log(`✅ Created employee: ${user.name} (${user.email})`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\nYou can now view them in the admin panel at /admin/users');
    console.log('\nTest credentials:');
    console.log('- Customer login: john.doe@example.com / password123');
    console.log('- Employee login: sarah.wilson@pizzabuilder.com / password123');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
