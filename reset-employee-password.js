const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function resetEmployeePassword() {
  const prisma = new PrismaClient();

  try {
    const email = 'staff101@greenlandFamous.com';
    const newPassword = 'employee123';
    
    console.log(`Resetting password for ${email}...`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword }
    });
    
    console.log(`✓ Password reset successfully for ${email}`);
    console.log(`New password: ${newPassword}`);
    
    // Test the new password
    const testHash = await bcrypt.compare(newPassword, hashedPassword);
    console.log(`✓ Password verification: ${testHash ? 'SUCCESS' : 'FAILED'}`);
    
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetEmployeePassword();
