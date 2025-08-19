const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function checkAndFixAdminPassword() {
  try {
    console.log('🔍 Checking admin@test.com credentials...\n');
    
    // Find the admin@test.com user
    const testAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@test.com'
      }
    });
    
    if (!testAdmin) {
      console.log('❌ admin@test.com user not found');
      return;
    }
    
    console.log('✅ Found admin@test.com user:');
    console.log(`   Name: ${testAdmin.name}`);
    console.log(`   Role: ${testAdmin.role}`);
    console.log(`   Created: ${testAdmin.createdAt}`);
    
    // Test if current password is 'admin123'
    const isPasswordCorrect = await bcrypt.compare('admin123', testAdmin.password);
    
    if (isPasswordCorrect) {
      console.log('✅ Password "admin123" is correct for admin@test.com');
    } else {
      console.log('❌ Password "admin123" does NOT match for admin@test.com');
      console.log('🔧 Resetting password to "admin123"...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Update the user with new password
      await prisma.user.update({
        where: {
          email: 'admin@test.com'
        },
        data: {
          password: hashedPassword
        }
      });
      
      console.log('✅ Password reset successfully!');
    }
    
    console.log('\n💡 Try logging in with:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    
    // Also check the other admin user
    console.log('\n🔍 Checking admin@pizzabuilder.com as alternative...');
    
    const pizzaAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@pizzabuilder.com'
      }
    });
    
    if (pizzaAdmin) {
      const isPizzaPasswordCorrect = await bcrypt.compare('admin123', pizzaAdmin.password);
      console.log(`   admin@pizzabuilder.com password "admin123": ${isPizzaPasswordCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      if (!isPizzaPasswordCorrect) {
        console.log('🔧 Resetting admin@pizzabuilder.com password too...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.update({
          where: {
            email: 'admin@pizzabuilder.com'
          },
          data: {
            password: hashedPassword
          }
        });
        console.log('✅ admin@pizzabuilder.com password reset!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixAdminPassword();
