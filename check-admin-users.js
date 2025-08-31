const { PrismaClient } = require('@prisma/client');

async function checkAdminUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking admin users in database...\n');

    // Check if there's a User table and look for admin users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('💡 You may need to create an admin user first');
      return;
    }

    console.log('👥 Users in database:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Role: ${user.role || 'N/A'}`);
      console.log(`  Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Check for admin role specifically
    const adminUsers = users.filter(user => user.role === 'ADMIN' || user.role === 'admin');
    if (adminUsers.length > 0) {
      console.log('👑 Admin users found:');
      adminUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`);
      });
    } else {
      console.log('⚠️  No users with admin role found');
      console.log('💡 You may need to promote a user to admin or create a new admin user');
    }

    // Check if there's a default admin account
    const defaultAdmin = users.find(user => user.email === 'admin@pizza.com' || user.email === 'admin@greenlandpizza.com');
    if (defaultAdmin) {
      console.log('🎯 Default admin account found:');
      console.log(`- Email: ${defaultAdmin.email}`);
      console.log(`- ID: ${defaultAdmin.id}`);
      console.log('⚠️  Note: Password is hashed in database, cannot display here');
    }

  } catch (error) {
    console.error('❌ Error checking admin users:', error.message);

    // If User table doesn't exist, let them know
    if (error.message.includes('user')) {
      console.log('💡 User table may not exist yet. You may need to run database migrations.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();
