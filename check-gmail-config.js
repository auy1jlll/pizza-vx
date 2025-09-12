const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGmailConfig() {
  try {
    console.log('🔍 Diagnosing Gmail Configuration...');
    console.log('=====================================');
    
    // Check environment variables
    console.log('\n📧 Environment Variables:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
    console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
    console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET');
    
    // Check database settings
    console.log('\n🗄️ Database Settings:');
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['gmailUser', 'gmailAppPassword', 'emailNotifications', 'emailServiceEnabled']
        }
      }
    });
    
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value}`);
    });
    
    // Test Gmail connection
    console.log('\n🧪 Testing Gmail Connection...');
    const nodemailer = require('nodemailer');
    
    const gmailUser = process.env.SMTP_USER || settings.find(s => s.key === 'gmailUser')?.value;
    const gmailPass = process.env.SMTP_PASS || settings.find(s => s.key === 'gmailAppPassword')?.value;
    
    if (!gmailUser || !gmailPass) {
      console.log('❌ Gmail credentials not found!');
      return;
    }
    
    console.log('Using Gmail User:', gmailUser);
    console.log('Using Gmail Pass:', gmailPass ? 'SET' : 'NOT SET');
    
    // Create transporter with proper Gmail configuration
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      // Add proper timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 10000,     // 10 seconds
      // Add retry configuration
      retryDelay: 2000,         // 2 seconds between retries
      maxRetries: 3,            // Maximum 3 retries
    });
    
    console.log('Testing connection...');
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
    
    // Test sending a simple email
    console.log('Testing email send...');
    const testResult = await transporter.sendMail({
      from: gmailUser,
      to: gmailUser, // Send to self for testing
      subject: 'Gmail Service Test',
      text: 'This is a test email to verify Gmail service is working.',
      html: '<p>This is a test email to verify Gmail service is working.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', testResult.messageId);
    
  } catch (error) {
    console.error('❌ Gmail configuration error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
  } finally {
    await prisma.$disconnect();
  }
}

checkGmailConfig();
