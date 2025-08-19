// Simple test to verify bulk uploader dependencies
const { PrismaClient } = require('@prisma/client');

async function testDependencies() {
  console.log('Testing dependencies...');
  
  try {
    const prisma = new PrismaClient();
    console.log('✅ Prisma client created successfully');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test csv-parse
    const csv = require('csv-parse/sync');
    console.log('✅ csv-parse module loaded successfully');
    
    await prisma.$disconnect();
    console.log('✅ All dependencies working correctly');
    
  } catch (error) {
    console.error('❌ Dependency test failed:', error.message);
  }
}

testDependencies();
