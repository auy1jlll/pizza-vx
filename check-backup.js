const fs = require('fs');

async function checkBackup(backupFile) {
  try {
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log('📊 Backup Data Analysis:');
    console.log(`Specialty Pizza Sizes: ${backup.specialtyPizzaSizes?.length || 0}`);
    console.log(`Specialty Calzone Sizes: ${backup.specialtyCalzoneSizes?.length || 0}`);
    console.log(`Specialty Pizzas: ${backup.specialtyPizzas?.length || 0}`);
    console.log(`Specialty Calzones: ${backup.specialtyCalzones?.length || 0}`);
    
    if (backup.specialtyPizzas?.length > 0) {
      console.log('\n🍕 First specialty pizza:');
      console.log(`Name: ${backup.specialtyPizzas[0].name}`);
      console.log(`Has sizes: ${backup.specialtyPizzas[0].sizes?.length || 0}`);
      if (backup.specialtyPizzas[0].sizes?.length > 0) {
        console.log('Sample size:', backup.specialtyPizzas[0].sizes[0]);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBackup(process.argv[2]);
