const { PrismaClient } = require('@prisma/client');

async function updateAllPizzaBuilderProReferences() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Updating all "Pizza Builder Pro" references to "Omar Pizza"...');
    
    // Update welcome message
    await prisma.appSetting.updateMany({
      where: { key: 'welcome_message' },
      data: { value: 'Welcome to Omar Pizza!' }
    });
    
    // Update footer text
    await prisma.appSetting.updateMany({
      where: { key: 'footer_text' },
      data: { value: '© 2025 Omar Pizza. All rights reserved.' }
    });
    
    // Update meta title
    await prisma.appSetting.updateMany({
      where: { key: 'meta_title' },
      data: { value: 'Omar Pizza - Custom Pizza Builder' }
    });
    
    // Update any other references
    const settingsWithPizzaBuilderPro = await prisma.appSetting.findMany({
      where: {
        value: {
          contains: 'Pizza Builder Pro'
        }
      }
    });
    
    console.log('Found settings with "Pizza Builder Pro":', settingsWithPizzaBuilderPro.length);
    
    for (const setting of settingsWithPizzaBuilderPro) {
      const updatedValue = setting.value.replace(/Pizza Builder Pro/g, 'Omar Pizza');
      await prisma.appSetting.update({
        where: { id: setting.id },
        data: { value: updatedValue }
      });
      console.log(`Updated ${setting.key}: ${setting.value} → ${updatedValue}`);
    }
    
    console.log('\n✅ All references updated to Omar Pizza!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllPizzaBuilderProReferences();
