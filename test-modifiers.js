const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testModifiers() {
  try {
    console.log('Testing modifier model...');
    
    // Test if modifier model exists
    console.log('Available models:', Object.keys(prisma));
    
    // Try to query modifiers
    const modifiers = await prisma.modifier.findMany();
    console.log('Modifiers found:', modifiers.length);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testModifiers();
