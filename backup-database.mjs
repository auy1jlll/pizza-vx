import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function createBackup() {
  try {
    console.log('🔄 Creating database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = `database_backup_${timestamp}.json`;
    
    // Export all data
    const backup = {
      timestamp: new Date().toISOString(),
      categories: await prisma.category.findMany({
        include: {
          items: {
            include: {
              customizationGroups: {
                include: {
                  customizationGroup: {
                    include: {
                      options: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      customizationGroups: await prisma.customizationGroup.findMany({
        include: {
          options: true
        }
      }),
      sizes: await prisma.size.findMany(),
      crusts: await prisma.crust.findMany(),
      sauces: await prisma.sauce.findMany(),
      toppings: await prisma.topping.findMany(),
      orders: await prisma.order.findMany({
        include: {
          items: true
        }
      }),
      users: await prisma.user.findMany(),
      settings: await prisma.setting.findMany(),
      specialtyPizzas: await prisma.specialtyPizza.findMany({
        include: {
          size: true,
          crust: true,
          sauce: true,
          toppings: true
        }
      })
    };
    
    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Database backup created: ${backupFile}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - ${backup.categories.length} categories`);
    console.log(`   - ${backup.categories.reduce((acc, cat) => acc + cat.items.length, 0)} menu items`);
    console.log(`   - ${backup.customizationGroups.length} customization groups`);
    console.log(`   - ${backup.sizes.length} sizes`);
    console.log(`   - ${backup.crusts.length} crusts`);
    console.log(`   - ${backup.sauces.length} sauces`);
    console.log(`   - ${backup.toppings.length} toppings`);
    console.log(`   - ${backup.orders.length} orders`);
    console.log(`   - ${backup.users.length} users`);
    console.log(`   - ${backup.settings.length} settings`);
    console.log(`   - ${backup.specialtyPizzas.length} specialty pizzas`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    // Note: Not calling prisma.$disconnect() to prevent dev server crash
    console.log('🔒 Keeping database connection alive for dev server');
  }
}

createBackup();
