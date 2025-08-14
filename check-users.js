const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });
    
    console.log('=== ALL USERS IN DATABASE ===');
    console.log('Total users:', users.length);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has Password: ${!!user.password}`);
      console.log(`  Password Hash (first 20 chars): ${user.password ? user.password.substring(0, 20) + '...' : 'None'}`);
      console.log('---');
    });
    
    const customerUsers = users.filter(u => u.role === 'CUSTOMER');
    console.log(`Customer users: ${customerUsers.length}`);
    
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    console.log(`Admin users: ${adminUsers.length}`);
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
