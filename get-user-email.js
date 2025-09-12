const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserEmail() {
  try {
    const user = await prisma.user.findFirst({
      select: { email: true }
    });
    
    if (user) {
      console.log('First user email:', user.email);
    } else {
      console.log('No users found in database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUserEmail();
