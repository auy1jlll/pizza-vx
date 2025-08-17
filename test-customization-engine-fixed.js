const { CustomizationEngine } = require('./src/lib/customization-engine.ts');

async function testCustomizationEngine() {
  const engine = new CustomizationEngine();
  
  try {
    console.log('🔧 Testing CustomizationEngine.getMenuData("dinner-plates")...\n');
    
    const result = await engine.getMenuData('dinner-plates');
    
    console.log(`✅ CustomizationEngine returned: ${result?.length || 0} items`);
    
    if (result && result.length > 0) {
      console.log('\n📋 Items found:');
      result.forEach((item, i) => {
        console.log(`   ${i+1}. ${item.name} (Category: ${item.category.name})`);
      });
    } else {
      console.log('❌ No items returned by CustomizationEngine');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await engine.disconnect();
  }
}

testCustomizationEngine();
