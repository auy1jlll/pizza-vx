const { PrismaClient } = require('@prisma/client');

async function checkCustomers() {
  const prisma = new PrismaClient();

  try {
    // Check all users by role
    console.log('=== ALL USERS BY ROLE ===');
    const allUsers = await prisma.user.findMany({
      include: {
        customerProfile: true,
        employeeProfile: true
      }
    });
    
    console.log('Total users:', allUsers.length);
    
    const roleCount = {};
    allUsers.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      console.log(`- ${user.email}: ${user.role} (Active: ${user.isActive})`);
      if (user.customerProfile) {
        console.log(`  Customer: ${user.customerProfile.firstName} ${user.customerProfile.lastName}`);
      }
      if (user.employeeProfile) {
        console.log(`  Employee: ${user.employeeProfile.firstName} ${user.employeeProfile.lastName} (${user.employeeProfile.employeeId})`);
      }
    });
    
    console.log('\n=== ROLE SUMMARY ===');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`${role}: ${count} users`);
    });

    // Check customers specifically
    console.log('\n=== CUSTOMERS ONLY ===');
    const customers = await prisma.user.findMany({
      where: { 
        role: 'CUSTOMER'
      },
      include: {
        customerProfile: true
      }
    });
    
    console.log('Customer users found:', customers.length);
    customers.forEach(customer => {
      console.log(`- ${customer.email} (Active: ${customer.isActive})`);
      if (customer.customerProfile) {
        console.log(`  Profile: ${customer.customerProfile.firstName} ${customer.customerProfile.lastName}`);
      } else {
        console.log('  No customer profile');
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCustomers();
