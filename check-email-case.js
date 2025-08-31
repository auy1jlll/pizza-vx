const { PrismaClient } = require('@prisma/client');

async function checkEmailVariations() {
  const prisma = new PrismaClient();

  try {
    console.log('=== CHECKING EMAIL VARIATIONS ===');
    
    const emailVariations = [
      'staff101@greenlandFamous.com',
      'staff101@greenlandfamous.com', 
      'Staff101@greenlandFamous.com',
      'Staff101@greenlandfamous.com'
    ];

    for (const email of emailVariations) {
      console.log(`\nChecking: ${email}`);
      
      const user = await prisma.user.findUnique({
        where: { email: email }
      });
      
      if (user) {
        console.log(`✓ FOUND: ${user.email} (Role: ${user.role})`);
      } else {
        console.log(`✗ NOT FOUND`);
      }
    }

    // Also do a case-insensitive search
    console.log('\n=== CASE-INSENSITIVE SEARCH ===');
    const allUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'staff101',
          mode: 'insensitive'
        }
      }
    });

    allUsers.forEach(user => {
      console.log(`Found user: ${user.email} (Role: ${user.role})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailVariations();
