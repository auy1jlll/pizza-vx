// Simple script to add Chicken Finger Platter directly
const fs = require('fs');
const path = require('path');

async function addChickenFingerPlatter() {
  try {
    console.log('🍗 Adding Chicken Finger Platter to dinner-plates...\n');

    // Let's check if there's a working pattern in existing scripts
    const scriptsDir = __dirname;
    const files = fs.readdirSync(scriptsDir).filter(f => f.startsWith('check-') && f.endsWith('.js'));
    
    if (files.length > 0) {
      console.log(`📝 Found existing script pattern: ${files[0]}`);
      const sampleScript = fs.readFileSync(path.join(scriptsDir, files[0]), 'utf8');
      console.log('First few lines of working script:');
      console.log(sampleScript.split('\n').slice(0, 10).join('\n'));
    }

    console.log('\n🎯 For now, let\'s use the admin interface instead!');
    console.log('👉 Go to: http://localhost:3005/admin/menu-manager/customizations');
    console.log('');
    console.log('🔧 MANUAL STEPS TO CREATE CHICKEN FINGER PLATTER:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('1️⃣ CREATE CUSTOMIZATION GROUPS:');
    console.log('   • Side Choice (Single Select, Required)');
    console.log('   • Salad Choice (Single Select, Required)'); 
    console.log('   • Sauce Selection (Multi Select, Optional)');
    console.log('');
    console.log('2️⃣ CREATE MENU ITEM:');
    console.log('   • Name: Chicken Finger Platter');
    console.log('   • Price: $14.99');
    console.log('   • Category: Dinner Plates');
    console.log('');
    console.log('3️⃣ LINK CUSTOMIZATIONS TO ITEM');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addChickenFingerPlatter();
