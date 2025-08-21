/**
 * Safe Database Script Template
 * 
 * Use this template for creating database scripts that won't crash the dev server.
 * This script demonstrates the proper pattern for database operations.
 */

import { createIsolatedPrismaClient } from '../lib/db';

async function safeDbScript() {
  console.log('🔧 Starting safe database operation...');
  
  // Create isolated client for this script only
  const prisma = createIsolatedPrismaClient();
  
  try {
    // Your database operations here
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true,
        customizationGroups: true
      }
    });
    
    console.log(`📋 Found ${categories.length} categories`);
    categories.forEach(category => {
      console.log(`  - ${category.name}: ${category.menuItems.length} items, ${category.customizationGroups.length} groups`);
    });
    
    console.log('✅ Database operation completed successfully');
    
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    throw error;
  } finally {
    // Only disconnect in scripts, not in Next.js app
    await prisma.$disconnect();
    console.log('🔌 Database connection closed safely');
  }
}

// Run the script
if (require.main === module) {
  safeDbScript()
    .then(() => {
      console.log('🎉 Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export default safeDbScript;
