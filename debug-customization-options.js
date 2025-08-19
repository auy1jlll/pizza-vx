const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugCustomizationOptions() {
  console.log('🔍 Debugging Customization Options');
  
  try {
    // Check if we have the menu item
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: "cmeg9p09p001fvkx0si55gox9" }
    });
    
    console.log('Menu Item:', menuItem ? `${menuItem.name} - $${menuItem.basePrice}` : 'Not found');
    
    // Check customization options
    const testOptionIds = [
      "bread-spinach-wrap",
      "topping-american-cheese", 
      "topping-cheese",
      "topping-bacon"
    ];
    
    console.log('\n🔍 Checking customization options:');
    for (const optionId of testOptionIds) {
      const option = await prisma.customizationOption.findUnique({
        where: { id: optionId }
      });
      
      if (option) {
        console.log(`✅ ${optionId}: ${option.name} (+$${option.priceModifier})`);
      } else {
        console.log(`❌ ${optionId}: Not found`);
      }
    }
    
    // Let's see what customization options exist
    console.log('\n🔍 All customization options (first 20):');
    const allOptions = await prisma.customizationOption.findMany({
      take: 20,
      include: {
        group: true
      }
    });
    
    allOptions.forEach(option => {
      console.log(`${option.id}: ${option.name} (${option.group?.name}) +$${option.priceModifier}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCustomizationOptions();
