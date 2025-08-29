import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static resend: Resend | null = null;
  private static isConfigured = false;

  private static getResendClient(): Resend {
    // Return existing client if available
    if (this.resend && this.isConfigured) {
      return this.resend;
    }

    // Get API key from environment
    const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY or SMTP_PASS environment variable is required');
    }

    this.resend = new Resend(apiKey);
    this.isConfigured = true;
    console.log('✅ Resend email service initialized');
    
    return this.resend;
  }

  static async sendPasswordResetEmail(to: string, resetLink: string, userName?: string): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      
      // Get from email configuration with fallback for unverified domain
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'onboarding@resend.dev';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';
      
      console.log(`📧 Sending password reset email to: ${to}`);
      console.log(`📧 From: ${fromName} <${fromEmail}>`);
      console.log(`📧 Using Resend API directly (not SMTP)`);
      
      const emailContent = this.generatePasswordResetEmailContent(resetLink, userName);
      
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject: 'Password Reset Request - Boston Pizza',
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's a domain verification issue
        if (error.message && error.message.includes('domain')) {
          console.error('🔍 Domain verification issue detected. Please ensure:');
          console.error('   1. DNS records are added to greenlandfamous.net');
          console.error('   2. Domain is verified in Resend dashboard');
          console.error('   3. Wait up to 48 hours for DNS propagation');
        }
        
        return false;
      }

      console.log('✅ Password reset email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      console.log('📧 From address used:', fromEmail);
      return true;

    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'Unknown error');
      return false;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      
      // Get from email configuration
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@resend.dev';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';
      
      console.log(`📧 Sending email to: ${options.to}`);
      console.log(`📧 Subject: ${options.subject}`);
      
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        return false;
      }

      console.log('✅ Email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  private static generatePasswordResetEmailContent(resetLink: string, userName?: string) {
    const greeting = userName ? `Hi ${userName}` : 'Hello';
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Boston Pizza</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #d32f2f; margin-bottom: 10px; }
          .button { display: inline-block; background: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #b71c1c; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; text-align: center; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🍕 Boston Pizza</div>
            <h2>Password Reset Request</h2>
          </div>
          
          <p>${greeting},</p>
          
          <p>We received a request to reset your password for your Boston Pizza account. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset My Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged if you don't click the link</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${resetLink}
          </p>
          
          <div class="footer">
            <p>Thanks for choosing Boston Pizza!</p>
            <p>If you have any questions, please contact our support team.</p>
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Password Reset Request - Boston Pizza

${greeting},

We received a request to reset your password for your Boston Pizza account.

To reset your password, please visit the following link:
${resetLink}

Important:
- This link will expire in 1 hour for security reasons
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged if you don't click the link

Thanks for choosing Boston Pizza!

This is an automated email. Please do not reply to this message.
    `.trim();

    return { html, text };
  }

  static async sendAccountConfirmationEmail(to: string, confirmationLink: string, userName: string): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      
      // Get from email configuration
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@resend.dev';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';
      
      console.log(`📧 Sending account confirmation email to: ${to}`);
      console.log(`📧 From: ${fromName} <${fromEmail}>`);
      
      const emailContent = this.generateAccountConfirmationEmailContent(confirmationLink, userName);
      
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject: 'Welcome to Boston Pizza - Please Confirm Your Account',
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        return false;
      }

      console.log('✅ Account confirmation email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      return true;

    } catch (error) {
      console.error('❌ Failed to send account confirmation email:', error);
      return false;
    }
  }

  static async sendOrderConfirmationEmail(to: string, orderDetails: any, userName?: string): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      
      // Get from email configuration
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@resend.dev';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';
      
      console.log(`📧 Sending order confirmation email to: ${to}`);
      console.log(`📧 Order ID: ${orderDetails.id}`);
      
      const emailContent = this.generateOrderConfirmationEmailContent(orderDetails, userName);
      
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject: `Order Confirmation #${orderDetails.id} - Boston Pizza`,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        return false;
      }

      console.log('✅ Order confirmation email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      return true;

    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }
}

export default EmailService;
