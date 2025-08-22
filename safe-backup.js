const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('🔄 Starting database backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Test and backup existing tables
    const data = { timestamp: new Date().toISOString() };
    
    try {
      data.pizzaSizes = await prisma.pizzaSize.findMany({ orderBy: { sortOrder: 'asc' } });
      console.log('✅ PizzaSize:', data.pizzaSizes.length, 'records');
    } catch (e) { console.log('⚠️ PizzaSize table not found'); }
    
    try {
      data.pizzaCrusts = await prisma.pizzaCrust.findMany({ orderBy: { sortOrder: 'asc' } });
      console.log('✅ PizzaCrust:', data.pizzaCrusts.length, 'records');
    } catch (e) { console.log('⚠️ PizzaCrust table not found'); }
    
    try {
      data.pizzaSauces = await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } });
      console.log('✅ PizzaSauce:', data.pizzaSauces.length, 'records');
    } catch (e) { console.log('⚠️ PizzaSauce table not found'); }
    
    try {
      data.pizzaToppings = await prisma.pizzaTopping.findMany({ orderBy: { sortOrder: 'asc' } });
      console.log('✅ PizzaTopping:', data.pizzaToppings.length, 'records');
    } catch (e) { console.log('⚠️ PizzaTopping table not found'); }
    
    try {
      data.appSettings = await prisma.appSettings.findMany();
      console.log('✅ AppSettings:', data.appSettings.length, 'records');
    } catch (e) { console.log('⚠️ AppSettings table not found'); }
    
    // Create backup file
    const backupFile = `calzone-dev-backup-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Database backup completed successfully!');
    console.log(`📁 Backup saved as: ${backupFile}`);
    
  } catch (error) {
    console.error('❌ Error during backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
