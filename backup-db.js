const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('💾 Creating database backup...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: {}
    };

    // Backup all main tables
    console.log('📋 Backing up PizzaSizes...');
    backup.data.pizzaSizes = await prisma.pizzaSize.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('📋 Backing up Crusts...');
    backup.data.crusts = await prisma.pizzaCrust.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('📋 Backing up Sauces...');
    backup.data.sauces = await prisma.pizzaSauce.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('📋 Backing up Toppings...');
    backup.data.toppings = await prisma.pizzaTopping.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('📋 Backing up Specialty Pizzas...');
    backup.data.specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log('📋 Backing up Settings...');
    backup.data.settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    console.log('📋 Backing up Users...');
    backup.data.users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
        // Exclude password hash for security
      },
      orderBy: { email: 'asc' }
    });

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Save backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `database-backup-${timestamp}.json`);
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log('✅ Database backup completed!');
    console.log(`📁 Backup saved to: ${backupFile}`);
    
    // Summary
    console.log('\n📊 Backup Summary:');
    console.log(`   Pizza Sizes: ${backup.data.pizzaSizes.length}`);
    console.log(`   Crusts: ${backup.data.crusts.length}`);
    console.log(`   Sauces: ${backup.data.sauces.length}`);
    console.log(`   Toppings: ${backup.data.toppings.length}`);
    console.log(`   Specialty Pizzas: ${backup.data.specialtyPizzas.length}`);
    console.log(`   Settings: ${backup.data.settings.length}`);
    console.log(`   Users: ${backup.data.users.length}`);

    // Show calzone vs pizza breakdown
    const pizzas = backup.data.specialtyPizzas.filter(p => p.category !== 'CALZONE');
    const calzones = backup.data.specialtyPizzas.filter(p => p.category === 'CALZONE');
    console.log(`   - Pizzas: ${pizzas.length}`);
    console.log(`   - Calzones: ${calzones.length}`);

    // Show pizza sizes breakdown
    const pizzaSizes = backup.data.pizzaSizes.filter(s => s.productType === 'PIZZA');
    const calzoneSizes = backup.data.pizzaSizes.filter(s => s.productType === 'CALZONE');
    console.log(`   Pizza Sizes: ${pizzaSizes.length}, Calzone Sizes: ${calzoneSizes.length}`);

    return backupFile;

  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase().catch(console.error);
