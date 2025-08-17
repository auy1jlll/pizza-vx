const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  // Use localhost connection for running outside Docker
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://pizzabuilder:pizzapassword@localhost:5432/pizzadb"
      }
    }
  });
  
  try {
    console.log('🔍 Checking users in database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Total users: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log('👥 Users found:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user.id}`);
      });
      
      const adminUsers = users.filter(user => user.role === 'ADMIN');
      console.log(`\n👑 Admin users: ${adminUsers.length}`);
      if (adminUsers.length > 0) {
        adminUsers.forEach(admin => {
          console.log(`   - ${admin.name} (${admin.email})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
