const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function checkEmployeeDetails() {
  const prisma = new PrismaClient();

  try {
    console.log('=== EMPLOYEE DETAILS ===');
    
    const employees = await prisma.user.findMany({
      where: { 
        OR: [
          { role: 'EMPLOYEE' },
          { role: 'ADMIN' }
        ]
      },
      include: {
        employeeProfile: true
      }
    });

    for (const employee of employees) {
      console.log(`\n--- ${employee.email} ---`);
      console.log(`Role: ${employee.role}`);
      console.log(`Active: ${employee.isActive}`);
      console.log(`Name: ${employee.name || 'Not set'}`);
      console.log(`Phone: ${employee.phone || 'Not set'}`);
      console.log(`Created: ${employee.createdAt}`);
      console.log(`Last Login: ${employee.lastLoginAt || 'Never'}`);
      
      if (employee.employeeProfile) {
        const profile = employee.employeeProfile;
        console.log(`Employee ID: ${profile.employeeId}`);
        console.log(`Full Name: ${profile.firstName} ${profile.lastName}`);
        console.log(`Position: ${profile.position || 'Not set'}`);
        console.log(`Department: ${profile.department || 'Not set'}`);
        console.log(`Permissions: ${profile.permissions?.join(', ') || 'None'}`);
        console.log(`Hourly Wage: $${profile.hourlyWage || 'Not set'}`);
        console.log(`Emergency Contact: ${profile.emergencyContactName || 'Not set'}`);
      } else {
        console.log('No employee profile found');
      }
      
      // Check if password seems to be a test password
      const testPasswords = ['password', 'admin123', 'employee123', '123456', 'test123'];
      for (const testPass of testPasswords) {
        const isMatch = await bcrypt.compare(testPass, employee.password);
        if (isMatch) {
          console.log(`✓ Password matches: ${testPass}`);
          break;
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmployeeDetails();
