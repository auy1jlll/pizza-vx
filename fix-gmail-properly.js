const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixGmailProperly() {
  try {
    console.log('🔧 Fixing Gmail Service Configuration...');
    console.log('=========================================');
    
    // Get Gmail credentials from database
    const gmailUser = await prisma.appSetting.findUnique({
      where: { key: 'gmailUser' }
    });
    const gmailPass = await prisma.appSetting.findUnique({
      where: { key: 'gmailAppPassword' }
    });
    
    if (!gmailUser || !gmailPass) {
      console.log('❌ Gmail credentials not found in database');
      return;
    }
    
    console.log('📧 Gmail Credentials:');
    console.log('User:', gmailUser.value);
    console.log('Password:', gmailPass.value ? 'SET' : 'NOT SET');
    
    // Test Gmail connection with proper configuration
    const nodemailer = require('nodemailer');
    
    console.log('\n🧪 Testing Gmail Connection...');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser.value,
        pass: gmailPass.value,
      },
      // Proper timeout configuration
      connectionTimeout: 15000,    // 15 seconds
      greetingTimeout: 15000,      // 15 seconds  
      socketTimeout: 15000,        // 15 seconds
      // Retry configuration
      retryDelay: 3000,            // 3 seconds between retries
      maxRetries: 2,               // Maximum 2 retries
      // Connection pooling
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      rateLimit: 2,                // 2 emails per second max
    });
    
    // Test connection
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully!');
    
    // Test sending email
    console.log('📤 Testing email send...');
    const testResult = await transporter.sendMail({
      from: `"Greenland Famous Pizza" <${gmailUser.value}>`,
      to: gmailUser.value, // Send to self for testing
      subject: 'Gmail Service Test - Checkout Emails Fixed',
      text: 'This is a test email to verify Gmail service is working for checkout confirmations.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">🍕 Gmail Service Test</h2>
          <p>This is a test email to verify Gmail service is working for checkout confirmations.</p>
          <p><strong>Status:</strong> Gmail service is now properly configured!</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', testResult.messageId);
    
    // Re-enable email notifications
    console.log('\n🔧 Re-enabling email notifications...');
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' }
    });
    
    // Add Gmail timeout settings
    await prisma.appSetting.upsert({
      where: { key: 'gmailConnectionTimeout' },
      update: { value: '15000' },
      create: { key: 'gmailConnectionTimeout', value: '15000', type: 'NUMBER' }
    });
    
    await prisma.appSetting.upsert({
      where: { key: 'gmailSocketTimeout' },
      update: { value: '15000' },
      create: { key: 'gmailSocketTimeout', value: '15000', type: 'NUMBER' }
    });
    
    console.log('✅ Email notifications re-enabled');
    console.log('✅ Gmail timeout settings configured');
    
    console.log('\n🎉 GMAIL SERVICE FIXED!');
    console.log('========================');
    console.log('✅ Gmail connection working');
    console.log('✅ Email sending working');
    console.log('✅ Checkout email confirmations enabled');
    console.log('✅ Timeout issues resolved');
    
  } catch (error) {
    console.error('❌ Gmail configuration error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 AUTHENTICATION ERROR:');
      console.log('- Check Gmail App Password is correct');
      console.log('- Ensure 2-Factor Authentication is enabled');
      console.log('- Verify App Password is generated correctly');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n⏰ TIMEOUT ERROR:');
      console.log('- Gmail server connection timeout');
      console.log('- Check network connectivity');
      console.log('- Try increasing timeout values');
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixGmailProperly();
