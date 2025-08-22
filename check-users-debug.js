const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...\n');
    
    // Get all users with simpler selection
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        customerProfile: {
          select: {
            firstName: true,
            lastName: true,
            loyaltyPoints: true
          }
        },
        employeeProfile: {
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            position: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Total users found: ${users.length}\n`);

    if (users.length === 0) {
      console.log('No users found in database.');
      console.log('You may need to create some test users first.\n');
      return;
    }

    // Group by role
    const customerUsers = users.filter(u => u.role === 'CUSTOMER');
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    const employeeUsers = users.filter(u => u.role === 'EMPLOYEE');

    console.log(`📊 User breakdown:`);
    console.log(`- Customers: ${customerUsers.length}`);
    console.log(`- Admins: ${adminUsers.length}`);
    console.log(`- Employees: ${employeeUsers.length}\n`);

    // Show customer details
    if (customerUsers.length > 0) {
      console.log('👥 CUSTOMERS:');
      customerUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleDateString()}`);
        if (user.customerProfile) {
          console.log(`   Profile: ${user.customerProfile.firstName || 'No first name'} ${user.customerProfile.lastName || 'No last name'}`);
          console.log(`   Loyalty Points: ${user.customerProfile.loyaltyPoints || 0}`);
        } else {
          console.log(`   Profile: None`);
        }
        console.log('');
      });
    }

    // Show admin details
    if (adminUsers.length > 0) {
      console.log('👑 ADMINS:');
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('');
      });
    }

    // Show employee details
    if (employeeUsers.length > 0) {
      console.log('👷 EMPLOYEES:');
      employeeUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Active: ${user.isActive}`);
        if (user.employeeProfile) {
          console.log(`   Employee ID: ${user.employeeProfile.employeeId}`);
          console.log(`   Position: ${user.employeeProfile.position || 'Not specified'}`);
        }
        console.log('');
      });
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
