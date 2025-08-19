const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  const settings = await prisma.appSetting.findMany();
  
  console.log('=== SETTINGS WITH EMPTY OR PROBLEMATIC VALUES ===');
  settings.forEach(s => {
    if (!s.value || s.value === '' || s.value === 'o' || s.value.length < 2) {
      console.log(`🔧 ${s.key}: '${s.value}'`);
    }
  });
  
  console.log('\n=== POTENTIAL DUPLICATE KEYS ===');
  const keyGroups = {};
  settings.forEach(s => {
    const normalized = s.key.toLowerCase().replace(/_/g, '');
    if (!keyGroups[normalized]) keyGroups[normalized] = [];
    keyGroups[normalized].push(s.key);
  });
  
  Object.keys(keyGroups).forEach(normalized => {
    if (keyGroups[normalized].length > 1) {
      console.log(`⚠️  Similar keys: ${keyGroups[normalized].join(', ')}`);
    }
  });
  
  await prisma.$disconnect();
}

checkSettings().catch(console.error);
