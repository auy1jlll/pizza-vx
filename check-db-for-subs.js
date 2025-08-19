const { PrismaClient } = require('@prisma/client');

// Initialize Prisma with better error handling
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
  process.exit(1);
}

async function checkDatabase() {
  try {
    console.log('=== CHECKING DATABASE FOR DELI SUBS SETUP ===\n');
    
    // Check existing categories
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log('📋 EXISTING CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - Sort: ${cat.sortOrder}`);
    });
    
    // Check if Deli Subs already exists
    const deliCategory = categories.find(cat => cat.slug === 'deli-subs');
    console.log('\n🥪 DELI SUBS CATEGORY:', deliCategory ? 'EXISTS' : 'NOT FOUND');
    
    // Check existing toppings
    const toppings = await prisma.topping.findMany();
    console.log('\n🧅 EXISTING TOPPINGS:');
    toppings.forEach(topping => {
      console.log(`  - ${topping.name} (+$${topping.price})`);
    });
    
    // Check existing customization options
    const customizations = await prisma.customizationOption.findMany({
      include: { group: true }
    });
    console.log('\n⚙️ EXISTING CUSTOMIZATION OPTIONS:');
    const groupedCustomizations = {};
    customizations.forEach(option => {
      const groupName = option.group?.name || 'No Group';
      if (!groupedCustomizations[groupName]) {
        groupedCustomizations[groupName] = [];
      }
      groupedCustomizations[groupName].push(option);
    });
    
    Object.entries(groupedCustomizations).forEach(([groupName, options]) => {
      console.log(`  ${groupName}:`);
      options.forEach(option => {
        console.log(`    - ${option.name} (+$${option.priceModifier})`);
      });
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Categories: ${categories.length}`);
    console.log(`Toppings: ${toppings.length}`);
    console.log(`Customization Options: ${customizations.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
