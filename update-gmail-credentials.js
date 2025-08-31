const { PrismaClient } = require('@prisma/client');

async function updateGmailSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('Updating Gmail settings with provided credentials...');

    // Update Gmail user
    await prisma.appSetting.upsert({
      where: { key: 'gmailUser' },
      update: {
        value: 'auy1jlll@gmail.com',
        type: 'STRING',
        updatedAt: new Date()
      },
      create: {
        key: 'gmailUser',
        value: 'auy1jlll@gmail.com',
        type: 'STRING'
      }
    });

    // Update Gmail app password
    await prisma.appSetting.upsert({
      where: { key: 'gmailAppPassword' },
      update: {
        value: 'apjniqjmtqmjmnwf',
        type: 'STRING',
        updatedAt: new Date()
      },
      create: {
        key: 'gmailAppPassword',
        value: 'apjniqjmtqmjmnwf',
        type: 'STRING'
      }
    });

    // Enable email service
    await prisma.appSetting.upsert({
      where: { key: 'emailServiceEnabled' },
      update: {
        value: 'true',
        type: 'BOOLEAN',
        updatedAt: new Date()
      },
      create: {
        key: 'emailServiceEnabled',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    console.log('Gmail settings updated successfully!');

    // Verify the settings
    const gmailSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['gmailUser', 'gmailAppPassword', 'emailServiceEnabled']
        }
      }
    });

    console.log('\nUpdated Gmail settings:');
    gmailSettings.forEach(setting => {
      if (setting.key === 'gmailAppPassword') {
        console.log(`- ${setting.key}: [HIDDEN] (${setting.type})`);
      } else {
        console.log(`- ${setting.key}: ${setting.value} (${setting.type})`);
      }
    });

    console.log('\n✅ Gmail service is now configured and ready to use!');
    console.log('You can test it by sending a test email from the management portal.');

  } catch (error) {
    console.error('Error updating Gmail settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateGmailSettings();
