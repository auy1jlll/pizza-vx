const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking for admin users...\n');
    
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in the database');
      console.log('💡 You need to create an admin user to access the kitchen display');
      console.log('🔧 Run the create-admin.js script to create one');
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
      console.log('💡 Use these credentials to login at: http://localhost:3005/admin/login');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();
