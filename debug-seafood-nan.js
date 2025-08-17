// Debug script to check seafood menu items and pricing issues
const { PrismaClient } = require('@prisma/client');

async function debugSeafoodPricing() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 DEBUGGING SEAFOOD NaN ISSUE');
    console.log('='.repeat(50));
    
    // Check all menu items with 'seafood' category
    console.log('\n📦 SEAFOOD MENU ITEMS IN DATABASE:');
    const seafoodItems = await prisma.menuItem.findMany({
      where: {
        category: {
          contains: 'seafood',
          mode: 'insensitive'
        }
      },
      include: {
        sizes: true
      }
    });
    
    console.log(`Found ${seafoodItems.length} seafood items:`);
    seafoodItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   - ID: ${item.id}`);
      console.log(`   - Category: ${item.category}`);
      console.log(`   - Base Price: ${item.basePrice}`);
      console.log(`   - Active: ${item.isActive}`);
      console.log(`   - Sizes: ${item.sizes.length}`);
      
      if (item.sizes.length > 0) {
        item.sizes.forEach(size => {
          console.log(`     * ${size.name}: $${size.price} (Active: ${size.isActive})`);
        });
      }
      
      // Check for NaN values
      if (isNaN(item.basePrice)) {
        console.log(`   ❌ BASE PRICE IS NaN!`);
      }
      if (item.sizes.some(size => isNaN(size.price))) {
        console.log(`   ❌ SOME SIZE PRICES ARE NaN!`);
        item.sizes.forEach(size => {
          if (isNaN(size.price)) {
            console.log(`     * ${size.name}: PRICE IS NaN`);
          }
        });
      }
    });
    
    // Check all menu items for potential pricing issues
    console.log('\n🔍 CHECKING ALL MENU ITEMS FOR PRICING ISSUES:');
    const allMenuItems = await prisma.menuItem.findMany({
      include: {
        sizes: true
      }
    });
    
    const itemsWithNaNPrices = allMenuItems.filter(item => 
      isNaN(item.basePrice) || item.sizes.some(size => isNaN(size.price))
    );
    
    if (itemsWithNaNPrices.length > 0) {
      console.log(`\n❌ FOUND ${itemsWithNaNPrices.length} ITEMS WITH NaN PRICES:`);
      itemsWithNaNPrices.forEach(item => {
        console.log(`- ${item.name} (${item.category})`);
        if (isNaN(item.basePrice)) {
          console.log(`  * Base price is NaN: ${item.basePrice}`);
        }
        item.sizes.forEach(size => {
          if (isNaN(size.price)) {
            console.log(`  * Size "${size.name}" price is NaN: ${size.price}`);
          }
        });
      });
    } else {
      console.log('✅ No items with NaN prices found in database');
    }
    
    // Check for null or undefined prices
    console.log('\n🔍 CHECKING FOR NULL/UNDEFINED PRICES:');
    const itemsWithNullPrices = allMenuItems.filter(item => 
      item.basePrice === null || item.basePrice === undefined || 
      item.sizes.some(size => size.price === null || size.price === undefined)
    );
    
    if (itemsWithNullPrices.length > 0) {
      console.log(`\n⚠️ FOUND ${itemsWithNullPrices.length} ITEMS WITH NULL/UNDEFINED PRICES:`);
      itemsWithNullPrices.forEach(item => {
        console.log(`- ${item.name} (${item.category})`);
        if (item.basePrice === null || item.basePrice === undefined) {
          console.log(`  * Base price is ${item.basePrice}`);
        }
        item.sizes.forEach(size => {
          if (size.price === null || size.price === undefined) {
            console.log(`  * Size "${size.name}" price is ${size.price}`);
          }
        });
      });
    } else {
      console.log('✅ No items with null/undefined prices found');
    }
    
  } catch (error) {
    console.error('❌ Error checking seafood pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSeafoodPricing();
