const { PrismaClient } = require('@prisma/client');

async function checkEmailSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking email notification settings...\n');

    // Check all email-related settings
    const emailSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'emailNotifications',
            'emailServiceEnabled',
            'gmailUser',
            'gmailAppPassword',
            'orderNotifications',
            'customerNotifications'
          ]
        }
      }
    });

    console.log('📧 Email Settings:');
    emailSettings.forEach(setting => {
      if (setting.key === 'gmailAppPassword') {
        console.log(`- ${setting.key}: [HIDDEN] (${setting.type})`);
      } else {
        console.log(`- ${setting.key}: ${setting.value} (${setting.type})`);
      }
    });

    console.log('\n🔍 Analyzing settings...');

    const emailNotifications = emailSettings.find(s => s.key === 'emailNotifications');
    const emailServiceEnabled = emailSettings.find(s => s.key === 'emailServiceEnabled');
    const orderNotifications = emailSettings.find(s => s.key === 'orderNotifications');
    const customerNotifications = emailSettings.find(s => s.key === 'customerNotifications');

    console.log(`- Email notifications enabled: ${emailNotifications?.value === 'true' ? '✅' : '❌'}`);
    console.log(`- Email service enabled: ${emailServiceEnabled?.value === 'true' ? '✅' : '❌'}`);
    console.log(`- Order notifications enabled: ${orderNotifications?.value === 'true' ? '✅' : '❌'}`);
    console.log(`- Customer notifications enabled: ${customerNotifications?.value === 'true' ? '✅' : '❌'}`);

    // Check if Gmail credentials are set
    const gmailUser = emailSettings.find(s => s.key === 'gmailUser');
    const gmailAppPassword = emailSettings.find(s => s.key === 'gmailAppPassword');

    console.log(`- Gmail user configured: ${gmailUser?.value ? '✅' : '❌'}`);
    console.log(`- Gmail app password configured: ${gmailAppPassword?.value ? '✅' : '❌'}`);

    console.log('\n📋 Summary:');
    if (emailNotifications?.value !== 'true') {
      console.log('❌ Email notifications are DISABLED - this is why no emails are being sent');
    }
    if (emailServiceEnabled?.value !== 'true') {
      console.log('❌ Email service is DISABLED');
    }
    if (!gmailUser?.value || !gmailAppPassword?.value) {
      console.log('❌ Gmail credentials are not properly configured');
    }

    if (emailNotifications?.value === 'true' && emailServiceEnabled?.value === 'true' && gmailUser?.value && gmailAppPassword?.value) {
      console.log('✅ All email settings are properly configured');
    }

  } catch (error) {
    console.error('❌ Error checking email settings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailSettings();
