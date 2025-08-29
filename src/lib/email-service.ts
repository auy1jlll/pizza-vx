import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;
  private static isConfigured = false;

  private static getTransporter(): nodemailer.Transporter {
    // Return existing transporter if available
    if (this.transporter && this.isConfigured) {
      return this.transporter;
    }

    // Check if SMTP configuration is available
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      // Production SMTP configuration with connection pooling
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort === '465', // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        pool: true, // Enable connection pooling
        maxConnections: 3, // Limit concurrent connections to save memory
        maxMessages: 50, // Limit messages per connection
        rateLimit: 5, // Limit to 5 emails per second to prevent spam
      });
      this.isConfigured = true;
      return this.transporter;
    }

    // Development configuration using Ethereal Email (fake SMTP service)
    console.log('⚠️ No SMTP configuration found. Using development mode with Ethereal Email.');
    console.log('📝 To receive real emails, configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env');
    console.log('🔗 In development mode, email preview URLs will be logged to console');
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
      pool: true, // Enable pooling even for dev
      maxConnections: 1,
      maxMessages: 10,
    });
    this.isConfigured = true;
    return this.transporter;
  }

  static async sendPasswordResetEmail(to: string, resetLink: string, userName?: string): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const emailOptions: EmailOptions = {
        to,
        subject: 'Password Reset Request - Boston Pizza',
        html: this.getPasswordResetTemplate(resetLink, userName),
        text: this.getPasswordResetTextTemplate(resetLink, userName),
      };

      await this.sendEmail(emailOptions, transporter);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
    // Don't close transporter - let connection pooling handle it
  }

  static async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const emailOptions: EmailOptions = {
        to,
        subject: 'Welcome to Boston Pizza! 🍕',
        html: this.getWelcomeTemplate(userName),
        text: this.getWelcomeTextTemplate(userName),
      };

      await this.sendEmail(emailOptions, transporter);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
    // Don't close transporter - let connection pooling handle it
  }

  static async sendOrderConfirmationEmail(to: string, orderData: any): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const emailOptions: EmailOptions = {
        to,
        subject: `Order Confirmation #${orderData.id} - Boston Pizza`,
        html: this.getOrderConfirmationTemplate(orderData),
        text: this.getOrderConfirmationTextTemplate(orderData),
      };

      await this.sendEmail(emailOptions, transporter);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
    // Don't close transporter - let connection pooling handle it
  }

  private static async sendEmail(options: EmailOptions, transporter: nodemailer.Transporter): Promise<void> {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@bostonpizza.com';
    const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Email sent:', info.messageId);
      if (info.previewURL) {
        console.log('🔗 Preview URL:', info.previewURL);
      }
    }
  }

  // Add cleanup method for graceful shutdown
  static async cleanup(): Promise<void> {
    if (this.transporter) {
      console.log('🧹 Closing email transporter...');
      this.transporter.close();
      this.transporter = null;
      this.isConfigured = false;
    }
  }

  private static getPasswordResetTemplate(resetLink: string, userName?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Boston Pizza</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍕 Boston Pizza</h1>
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hello${userName ? ` ${userName}` : ''},</p>
              <p>You requested a password reset for your Boston Pizza account. Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>If you didn't request this reset, please ignore this email. The link will expire in 1 hour.</p>
              <p>If the button doesn't work, copy and paste this link: ${resetLink}</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Boston Pizza. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getPasswordResetTextTemplate(resetLink: string, userName?: string): string {
    return `
Boston Pizza - Password Reset

Hello${userName ? ` ${userName}` : ''},

You requested a password reset for your Boston Pizza account.

Reset your password here: ${resetLink}

If you didn't request this reset, please ignore this email. The link will expire in 1 hour.

© 2025 Boston Pizza. All rights reserved.
    `;
  }

  private static getWelcomeTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Boston Pizza!</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍕 Welcome to Boston Pizza!</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>Welcome to Boston Pizza! Your account has been successfully created.</p>
              <p>You can now enjoy:</p>
              <ul>
                <li>🍕 Custom pizza builder</li>
                <li>🥟 Specialty calzones</li>
                <li>🚚 Easy online ordering</li>
                <li>📱 Order tracking</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="button">Start Ordering</a>
            </div>
            <div class="footer">
              <p>&copy; 2025 Boston Pizza. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getWelcomeTextTemplate(userName: string): string {
    return `
Boston Pizza - Welcome!

Hello ${userName},

Welcome to Boston Pizza! Your account has been successfully created.

You can now enjoy:
- Custom pizza builder
- Specialty calzones  
- Easy online ordering
- Order tracking

Start ordering: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}

© 2025 Boston Pizza. All rights reserved.
    `;
  }

  private static getOrderConfirmationTemplate(orderData: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - Boston Pizza</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; }
            .order-details { background: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍕 Boston Pizza</h1>
              <h2>Order Confirmation</h2>
            </div>
            <div class="content">
              <p>Thank you for your order!</p>
              <div class="order-details">
                <h3>Order #${orderData.id}</h3>
                <p><strong>Total:</strong> $${orderData.total}</p>
                <p><strong>Status:</strong> ${orderData.status}</p>
                <p><strong>Estimated delivery:</strong> ${orderData.estimatedDelivery}</p>
              </div>
              <p>We'll keep you updated on your order status.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Boston Pizza. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getOrderConfirmationTextTemplate(orderData: any): string {
    return `
Boston Pizza - Order Confirmation

Thank you for your order!

Order #${orderData.id}
Total: $${orderData.total}
Status: ${orderData.status}
Estimated delivery: ${orderData.estimatedDelivery}

We'll keep you updated on your order status.

© 2025 Boston Pizza. All rights reserved.
    `;
  }
}
