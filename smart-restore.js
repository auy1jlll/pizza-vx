const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function smartRestore(backupFile, options = {}) {
  const {
    preserveRecent = true,
    confirmBeforeRestore = true,
    createPreRestoreBackup = true
  } = options;

  console.log('🛡️ Smart Restore System - Protecting Your Work');
  console.log('===============================================');

  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const backupDate = new Date(backup.timestamp);
    
    console.log(`📅 Backup from: ${backupDate.toLocaleString()}`);
    console.log(`⏰ Age: ${Math.round((Date.now() - backupDate.getTime()) / (1000 * 60))} minutes old`);

    // Check for recent data that might be lost
    if (preserveRecent) {
      console.log('\n🔍 Checking for recent work that could be lost...');
      
      const recentCutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
      
      const recentData = {
        orders: await prisma.order.count({ where: { createdAt: { gte: recentCutoff } } }),
        menuItems: await prisma.menuItem.count({ where: { updatedAt: { gte: recentCutoff } } }),
        toppings: await prisma.pizzaTopping.count({ where: { updatedAt: { gte: recentCutoff } } }),
        settings: await prisma.appSetting.count({ where: { updatedAt: { gte: recentCutoff } } }),
        users: await prisma.user.count({ where: { createdAt: { gte: recentCutoff } } })
      };

      const hasRecentWork = Object.values(recentData).some(count => count > 0);
      
      if (hasRecentWork) {
        console.log('\n⚠️  WARNING: Found recent work that will be LOST:');
        Object.entries(recentData).forEach(([type, count]) => {
          if (count > 0) {
            console.log(`   - ${count} recent ${type}`);
          }
        });

        if (confirmBeforeRestore) {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          const answer = await new Promise((resolve) => {
            rl.question('\n❓ Do you want to continue? This will DELETE your recent work! (type "yes" to confirm): ', resolve);
          });
          rl.close();

          if (answer.toLowerCase() !== 'yes') {
            console.log('✅ Restore cancelled - your work is safe!');
            return;
          }
        }
      } else {
        console.log('✅ No recent work detected - safe to restore');
      }
    }

    // Create pre-restore backup
    if (createPreRestoreBackup) {
      console.log('\n💾 Creating pre-restore backup...');
      const { backupAllData } = require('./backup-data');
      const preRestoreBackup = await backupAllData();
      console.log(`✅ Pre-restore backup saved: ${preRestoreBackup}`);
    }

    // Proceed with restore
    console.log('\n🔄 Starting restore process...');
    const { restoreAllData } = require('./restore-data');
    await restoreAllData(backupFile);

    console.log('\n🎉 Smart restore completed successfully!');
    
  } catch (error) {
    console.error('❌ Smart restore failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Usage examples:
// node smart-restore.js path/to/backup.json                    # Safe restore with all protections
// node smart-restore.js path/to/backup.json --force            # Skip recent work check
// node smart-restore.js path/to/backup.json --no-backup       # Skip pre-restore backup

if (require.main === module) {
  const backupFile = process.argv[2];
  const force = process.argv.includes('--force');
  const noBackup = process.argv.includes('--no-backup');

  if (!backupFile) {
    console.error('Usage: node smart-restore.js <backup-file> [--force] [--no-backup]');
    process.exit(1);
  }

  const options = {
    preserveRecent: !force,
    confirmBeforeRestore: !force,
    createPreRestoreBackup: !noBackup
  };

  smartRestore(backupFile, options).catch(console.error);
}

module.exports = { smartRestore };
