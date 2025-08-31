const { PrismaClient } = require('@prisma/client');

async function setupGmail() {
  const prisma = new PrismaClient();

  try {
    await prisma.appSetting.upsert({
      where: { key: 'gmailUser' },
      update: { value: 'auy1jlll@gmail.com', type: 'STRING' },
      create: { key: 'gmailUser', value: 'auy1jlll@gmail.com', type: 'STRING' }
    });

    await prisma.appSetting.upsert({
      where: { key: 'gmailAppPassword' },
      update: { value: 'apjniqjmtqmjmnwf', type: 'STRING' },
      create: { key: 'gmailAppPassword', value: 'apjniqjmtqmjmnwf', type: 'STRING' }
    });

    console.log('✅ Gmail credentials saved to database');
  } catch (error) {
    console.error('❌ Error saving Gmail credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupGmail();
