const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupAllData() {
  console.log('🔄 Creating complete data backup...');
  
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      users: await prisma.user.findMany(),
      employeeProfiles: await prisma.employeeProfile.findMany(),
      customerProfiles: await prisma.customerProfile.findMany(),
      menuCategories: await prisma.menuCategory.findMany(),
      menuItems: await prisma.menuItem.findMany(),
      specialtyPizzas: await prisma.specialtyPizza.findMany(),
      specialtyCalzones: await prisma.specialtyCalzone.findMany(),
      pizzaSizes: await prisma.pizzaSize.findMany(),
      pizzaCrusts: await prisma.pizzaCrust.findMany(),
      pizzaSauces: await prisma.pizzaSauce.findMany(),
      pizzaToppings: await prisma.pizzaTopping.findMany(),
      specialtyPizzaSizes: await prisma.specialtyPizzaSize.findMany(),
      specialtyCalzoneSizes: await prisma.specialtyCalzoneSize.findMany(),
      appSettings: await prisma.appSetting.findMany(),
      promotions: await prisma.promotion.findMany(),
      customizationGroups: await prisma.customizationGroup.findMany(),
      customizationOptions: await prisma.customizationOption.findMany(),
      menuItemCustomizations: await prisma.menuItemCustomization.findMany(),
      modifiers: await prisma.modifier.findMany(),
      itemModifiers: await prisma.itemModifier.findMany(),
      orders: await prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              toppings: true,
              customizations: true
            }
          }
        }
      }),
      emailTemplates: await prisma.emailTemplate.findMany(),
      emailSettings: await prisma.emailSettings.findMany(),
      jwtSecrets: await prisma.jwtSecret.findMany()
    };

    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, 'data-backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `complete-backup-${timestamp}.json`);
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Complete backup saved to: ${backupFile}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - Users: ${backup.users.length}`);
    console.log(`   - Menu Items: ${backup.menuItems.length}`);
    console.log(`   - Pizza Toppings: ${backup.pizzaToppings.length}`);
    console.log(`   - Specialty Pizzas: ${backup.specialtyPizzas.length}`);
    console.log(`   - App Settings: ${backup.appSettings.length}`);
    console.log(`   - Orders: ${backup.orders.length}`);
    
    return backupFile;
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  backupAllData().catch(console.error);
}

module.exports = { backupAllData };
