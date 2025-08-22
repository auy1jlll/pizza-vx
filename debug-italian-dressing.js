const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugItalianDressing() {
  try {
    // Find the dressing group
    const dressingGroup = await prisma.customizationGroup.findFirst({
      where: { name: { contains: 'Dressing', mode: 'insensitive' } },
      include: { options: true }
    });
    
    if (!dressingGroup) {
      console.log('No dressing group found');
      return;
    }
    
    console.log('=== DRESSING OPTIONS DEBUG ===');
    console.log('Group Type:', dressingGroup.type);
    console.log('Group Max Selections:', dressingGroup.maxSelections);
    console.log('');
    
    // Check each dressing option
    dressingGroup.options.forEach(option => {
      console.log(`${option.name}:`);
      console.log(`  - maxQuantity: ${option.maxQuantity}`);
      console.log(`  - isActive: ${option.isActive}`);
      console.log(`  - priceModifier: ${option.priceModifier}`);
      console.log('');
    });
    
    // Specifically check Italian and Oil & Vinegar
    const italian = dressingGroup.options.find(opt => 
      opt.name.toLowerCase().includes('italian')
    );
    const oilVinegar = dressingGroup.options.find(opt => 
      opt.name.toLowerCase().includes('oil') && opt.name.toLowerCase().includes('vinegar')
    );
    
    console.log('=== PROBLEMATIC DRESSINGS ===');
    if (italian) {
      console.log('Italian Dressing:', {
        name: italian.name,
        maxQuantity: italian.maxQuantity,
        isActive: italian.isActive
      });
    }
    
    if (oilVinegar) {
      console.log('Oil & Vinegar:', {
        name: oilVinegar.name,
        maxQuantity: oilVinegar.maxQuantity,
        isActive: oilVinegar.isActive
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugItalianDressing();
