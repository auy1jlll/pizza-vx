const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEmailSettings() {
  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['emailNotifications', 'gmailUser', 'gmailAppPassword', 'emailServiceEnabled']
        }
      }
    });
    
    console.log('Email Settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailSettings();