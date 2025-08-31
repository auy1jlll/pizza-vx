const { PrismaClient } = require('@prisma/client');

async function initializeGmailSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('Initializing Gmail settings in database...');

    // Check if Gmail settings already exist
    const existingSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['gmailUser', 'gmailAppPassword', 'emailServiceEnabled', 'emailFromName', 'emailReplyTo']
        }
      }
    });

    const existingKeys = existingSettings.map(s => s.key);
    console.log('Existing Gmail settings:', existingKeys);

    // Settings to create if they don't exist
    const settingsToCreate = [
      {
        key: 'gmailUser',
        value: '',
        type: 'STRING'
      },
      {
        key: 'gmailAppPassword',
        value: '',
        type: 'STRING'
      },
      {
        key: 'emailServiceEnabled',
        value: 'false',
        type: 'BOOLEAN'
      },
      {
        key: 'emailFromName',
        value: 'Greenland Famous Pizza',
        type: 'STRING'
      },
      {
        key: 'emailReplyTo',
        value: '',
        type: 'STRING'
      }
    ];

    // Create settings that don't exist
    for (const setting of settingsToCreate) {
      if (!existingKeys.includes(setting.key)) {
        await prisma.appSetting.create({
          data: setting
        });
        console.log(`Created setting: ${setting.key}`);
      } else {
        console.log(`Setting already exists: ${setting.key}`);
      }
    }

    // Display all Gmail-related settings
    const allGmailSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['gmailUser', 'gmailAppPassword', 'emailServiceEnabled', 'emailFromName', 'emailReplyTo']
        }
      }
    });

    console.log('\nGmail settings in database:');
    allGmailSettings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value} (${setting.type})`);
    });

    console.log('\nGmail settings initialized successfully!');
    console.log('You can now configure these settings in the management portal at /management-portal/global-settings');

  } catch (error) {
    console.error('Error initializing Gmail settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeGmailSettings();
