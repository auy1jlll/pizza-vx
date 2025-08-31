const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

async function testGmailService() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing Gmail service configuration...\n');

    // Check database settings
    const gmailUser = await prisma.appSetting.findUnique({
      where: { key: 'gmailUser' }
    });

    const gmailAppPassword = await prisma.appSetting.findUnique({
      where: { key: 'gmailAppPassword' }
    });

    const emailServiceEnabled = await prisma.appSetting.findUnique({
      where: { key: 'emailServiceEnabled' }
    });

    console.log('📋 Database Settings:');
    console.log(`- Gmail User: ${gmailUser?.value || 'Not set'}`);
    console.log(`- Gmail App Password: ${gmailAppPassword?.value ? '[SET]' : 'Not set'}`);
    console.log(`- Email Service Enabled: ${emailServiceEnabled?.value || 'false'}`);
    console.log();

    if (!gmailUser?.value || !gmailAppPassword?.value) {
      console.log('❌ Gmail credentials not found in database');
      return;
    }

    if (emailServiceEnabled?.value !== 'true') {
      console.log('⚠️  Email service is disabled');
    }

    console.log('🚀 Testing Gmail connection...');

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.value,
        pass: gmailAppPassword.value,
      },
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log('✅ Gmail connection successful!');
    } catch (verifyError) {
      console.log('❌ Gmail connection failed:', verifyError.message);
      return;
    }

    // Send test email
    console.log('📧 Sending test email...');
    const testEmail = gmailUser.value; // Send to self for testing

    const mailOptions = {
      from: `"Greenland Famous Pizza" <${gmailUser.value}>`,
      to: testEmail,
      subject: 'Test Email - Gmail Service Working! 🍕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🎉 Gmail Service Test Successful!</h2>
          <p>Your email service is now working properly.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>✅ Database connection: Working</li>
            <li>✅ Gmail authentication: Working</li>
            <li>✅ Email sending: Working</li>
          </ul>
          <p>This email was sent from your pizza ordering system.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📧 Sent to: ${testEmail}`);

    console.log('\n🎊 Email service is fully functional!');
    console.log('You can now send emails from your pizza ordering system.');

  } catch (error) {
    console.error('❌ Error testing Gmail service:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testGmailService();
