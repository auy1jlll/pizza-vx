const { backupAllData } = require('./backup-data');
const { restoreAllData } = require('./restore-data');
const fs = require('fs');
const path = require('path');

async function listBackups() {
  const backupDir = path.join(__dirname, 'data-backups');
  if (!fs.existsSync(backupDir)) {
    console.log('No backups found. Create a backup first with: node backup-data.js');
    return;
  }

  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse(); // newest first

  if (files.length === 0) {
    console.log('No backup files found.');
    return;
  }

  console.log('📋 Available backups:');
  files.forEach((file, index) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`${index + 1}. ${file} (${size} KB) - ${stats.mtime.toLocaleString()}`);
  });

  return files.map(f => path.join(backupDir, f));
}

async function autoBackup() {
  console.log('🔄 Creating automatic backup before any operations...');
  await backupAllData();
}

async function quickRestore() {
  const backups = await listBackups();
  if (!backups || backups.length === 0) {
    console.log('❌ No backups available for restoration.');
    return;
  }

  console.log('\n🔄 Restoring from most recent backup...');
  await restoreAllData(backups[0]);
}

async function interactiveMenu() {
  console.log('\n🍕 Pizza-VX Data Management Tool');
  console.log('================================');
  console.log('1. Create backup now');
  console.log('2. List all backups');
  console.log('3. Quick restore (latest backup)');
  console.log('4. Exit');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nSelect option (1-4): ', async (answer) => {
      rl.close();
      
      switch(answer.trim()) {
        case '1':
          await backupAllData();
          break;
        case '2':
          await listBackups();
          break;
        case '3':
          await quickRestore();
          break;
        case '4':
          console.log('👋 Goodbye!');
          break;
        default:
          console.log('❌ Invalid option');
      }
      resolve();
    });
  });
}

if (require.main === module) {
  const arg = process.argv[2];
  
  switch(arg) {
    case 'backup':
      backupAllData().catch(console.error);
      break;
    case 'list':
      listBackups().catch(console.error);
      break;
    case 'restore':
      quickRestore().catch(console.error);
      break;
    case 'auto':
      autoBackup().catch(console.error);
      break;
    default:
      interactiveMenu().catch(console.error);
  }
}

module.exports = { listBackups, autoBackup, quickRestore };
