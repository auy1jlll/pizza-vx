const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('🔄 Starting database backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Backup all pizza-related data
    const data = {
      timestamp: new Date().toISOString(),
      pizzaSizes: await prisma.pizzaSize.findMany({ orderBy: { sortOrder: 'asc' } }),
      pizzaCrusts: await prisma.pizzaCrust.findMany({ orderBy: { sortOrder: 'asc' } }),
      pizzaSauces: await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } }),
      pizzaToppings: await prisma.pizzaTopping.findMany({ orderBy: { sortOrder: 'asc' } }),
      appSettings: await prisma.appSettings.findMany()
    };
    
    // Create backup file
    const backupFile = `calzone-dev-backup-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    
    console.log('✅ Database backup completed successfully!');
    console.log(`📁 Backup saved as: ${backupFile}`);
    console.log(`📊 Data Summary:`);
    console.log(`   - Pizza Sizes: ${data.pizzaSizes.length}`);
    console.log(`   - Pizza Crusts: ${data.pizzaCrusts.length}`);
    console.log(`   - Pizza Sauces: ${data.pizzaSauces.length}`);
    console.log(`   - Pizza Toppings: ${data.pizzaToppings.length}`);
    console.log(`   - App Settings: ${data.appSettings.length}`);
    
  } catch (error) {
    console.error('❌ Error during backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
