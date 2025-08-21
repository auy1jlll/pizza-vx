// Simple database backup using existing connection pattern
import { prisma } from './src/lib/prisma.js';
import fs from 'fs';

async function simpleBackup() {
  try {
    console.log('🔄 Creating simple database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = `database_backup_${timestamp}.json`;
    
    // Basic backup of key tables
    const backup = {
      timestamp: new Date().toISOString(),
      categories: await prisma.category.findMany(),
      menuItems: await prisma.menuItem.findMany(),
      sizes: await prisma.size.findMany(),
      crusts: await prisma.crust.findMany(),
      sauces: await prisma.sauce.findMany(),
      toppings: await prisma.topping.findMany(),
      settings: await prisma.setting.findMany(),
      users: await prisma.user.count() // Just count for privacy
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Database backup created: ${backupFile}`);
    console.log(`📊 Backup contains ${backup.categories.length} categories, ${backup.menuItems.length} menu items`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

simpleBackup();
