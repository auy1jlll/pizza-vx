const fs = require('fs').promises;
const path = require('path');

async function verifyBackup() {
  try {
    // Use the specific backup directory we created
    const latestBackup = 'backup-2025-08-22T02-34-43-376Z';
    
    console.log(`🔍 Verifying backup: ${latestBackup}\n`);

    const backupPath = path.join(__dirname, latestBackup);
    
    // Read summary
    const summary = JSON.parse(await fs.readFile(path.join(backupPath, 'backup-summary.json'), 'utf8'));
    
    console.log('📊 Backup Summary:');
    console.log(`   📅 Created: ${new Date(summary.backupDate).toLocaleString()}`);
    console.log(`   📁 Location: ${summary.backupDirectory}`);
    console.log(`   📊 Total Records: ${Object.values(summary.tables).reduce((a, b) => a + b, 0)}`);
    
    console.log('\n📋 Data Breakdown:');
    Object.entries(summary.tables).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`);
    });

    console.log('\n🏪 Menu Categories:');
    summary.categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} - ${cat.itemCount} items`);
    });

    // Verify all files exist
    console.log('\n📁 Backup Files:');
    const expectedFiles = [
      'backup-summary.json',
      'menu-categories-full.json',
      'app-settings.json',
      'menu-categories.json',
      'menu-items.json',
      'customization-groups.json',
      'customization-options.json',
      'menu-item-customizations.json',
      'restore-database.js'
    ];

    for (const file of expectedFiles) {
      try {
        const stats = await fs.stat(path.join(backupPath, file));
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`   ✓ ${file} (${sizeKB} KB)`);
      } catch (error) {
        console.log(`   ❌ ${file} - Missing!`);
      }
    }

    console.log('\n✅ Backup verification completed!');
    console.log('\n🔧 To restore this backup:');
    console.log(`   cd "${backupPath}"`);
    console.log('   node restore-database.js');

  } catch (error) {
    console.error('❌ Error verifying backup:', error);
  }
}

verifyBackup();
