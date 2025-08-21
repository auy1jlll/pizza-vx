const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCustomizationPrices() {
  try {
    console.log('Starting customization price fix...');
    
    // Get all customization options that are not percentage-based
    const options = await prisma.customizationOption.findMany({
      where: {
        priceType: {
          not: 'PERCENTAGE'
        }
      }
    });
    
    console.log(`Found ${options.length} non-percentage customization options`);
    
    // Update each option to convert from cents to dollars
    for (const option of options) {
      const newPriceModifier = option.priceModifier / 100;
      
      await prisma.customizationOption.update({
        where: { id: option.id },
        data: { priceModifier: newPriceModifier }
      });
      
      console.log(`Updated ${option.name}: ${option.priceModifier} cents -> $${newPriceModifier.toFixed(2)}`);
    }
    
    console.log('Customization price fix completed!');
    
  } catch (error) {
    console.error('Error fixing customization prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCustomizationPrices();
