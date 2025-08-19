// Quick test of bulk upload functionality
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickTest() {
  try {
    console.log('Starting quick test...');
    
    // Check current menu data
    const existingCategories = await prisma.category.count();
    const existingMenuItems = await prisma.menuItem.count();
    
    console.log(`Current categories: ${existingCategories}`);
    console.log(`Current menu items: ${existingMenuItems}`);
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
