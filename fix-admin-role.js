const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminRole() {
  try {
    console.log('🔧 Fixing admin role for admin@pizzabuilder.com...');
    
    // Update the admin@pizzabuilder.com account to have ADMIN role
    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin@pizzabuilder.com'
      },
      data: {
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Updated user:', updatedUser.email, 'Role:', updatedUser.role);
    
    // Also verify all admin accounts
    console.log('\n📋 All admin accounts after update:');
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });
    
    adminUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole();
