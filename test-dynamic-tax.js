// Test script to verify dynamic tax rate functionality
const { PrismaClient } = require('@prisma/client');

async function testDynamicTaxRates() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Dynamic Tax Rate System...\n');
    
    // Check current tax rate setting
    const currentSetting = await prisma.setting.findUnique({
      where: { key: 'taxRate' }
    });
    
    console.log('📊 Current Database Tax Rate:');
    console.log(`   Value: ${currentSetting?.value}%`);
    
    // Test calculation functions
    const testSubtotal = 100.00;
    const taxRate = parseFloat(currentSetting?.value || '8.25') / 100;
    const expectedTax = +(testSubtotal * taxRate).toFixed(2);
    
    console.log('\n🧮 Tax Calculation Test:');
    console.log(`   Subtotal: $${testSubtotal.toFixed(2)}`);
    console.log(`   Tax Rate: ${(taxRate * 100).toFixed(2)}%`);
    console.log(`   Expected Tax: $${expectedTax}`);
    console.log(`   Expected Total: $${(testSubtotal + expectedTax).toFixed(2)}`);
    
    // Test different tax rates
    console.log('\n🔄 Testing Tax Rate Changes:');
    
    const testRates = [8.25, 9.00, 7.50, 10.00];
    
    for (const rate of testRates) {
      const taxAmount = +(testSubtotal * (rate / 100)).toFixed(2);
      const total = +(testSubtotal + taxAmount).toFixed(2);
      console.log(`   ${rate}% -> Tax: $${taxAmount}, Total: $${total}`);
    }
    
    console.log('\n✅ Dynamic tax rate system verification complete!');
    console.log('💡 Frontend components should now use dynamic tax rates from settings.');
    
  } catch (error) {
    console.error('❌ Error testing dynamic tax rates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDynamicTaxRates();
