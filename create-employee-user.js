const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createEmployeeUser() {
  try {
    console.log('👨‍🍳 Creating employee user for kitchen access...\n');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('kitchen123', 10);
    
    // Delete existing employee user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'kitchen@pizzabuilder.com'
      }
    });
    
    // Create new employee user
    const employeeUser = await prisma.user.create({
      data: {
        email: 'kitchen@pizzabuilder.com',
        name: 'Kitchen Staff',
        password: hashedPassword,
        role: 'EMPLOYEE'
      }
    });
    
    console.log('✅ Employee user created successfully!');
    console.log('📧 Email: kitchen@pizzabuilder.com');
    console.log('🔑 Password: kitchen123');
    console.log('👤 Role: EMPLOYEE');
    console.log('🆔 User ID:', employeeUser.id);
    console.log('\n💡 This user can now access the kitchen display!');
    
  } catch (error) {
    console.error('❌ Error creating employee user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createEmployeeUser();
