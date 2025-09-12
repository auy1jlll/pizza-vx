
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class GmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;
  private storeName: string;
  private initialized: boolean = false;

  constructor() {
    this.storeName = process.env.STORE_NAME || 'Greenland Famous Pizza';
    this.initializeService();
  }

  private async initializeService() {
    try {
      // First try to get credentials from database
      let gmailUser = '';
      let gmailAppPassword = '';

      try {
        const userSetting = await prisma.appSetting.findUnique({
          where: { key: 'gmailUser' }
        });
        const passwordSetting = await prisma.appSetting.findUnique({
          where: { key: 'gmailAppPassword' }
        });

        gmailUser = userSetting?.value || '';
        gmailAppPassword = passwordSetting?.value || '';
      } catch (dbError) {
        console.warn('Database not available for Gmail settings, falling back to environment variables');
      }

      // Fallback to environment variables if database doesn't have settings
      if (!gmailUser) {
        gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || '';
      }
      if (!gmailAppPassword) {
        gmailAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';
      }

      this.fromEmail = gmailUser;

      if (!gmailUser || !gmailAppPassword) {
        console.warn('Gmail credentials not found in database or environment. Email service will not work.');
        return;
      }

      // Create transporter with proper timeout and retry configuration
      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
        // Add proper timeout settings to prevent hanging
        connectionTimeout: 10000,    // 10 seconds
        greetingTimeout: 10000,      // 10 seconds
        socketTimeout: 10000,        // 10 seconds
        // Add retry configuration
        retryDelay: 2000,            // 2 seconds between retries
        maxRetries: 2,               // Maximum 2 retries
        // Connection pooling for better performance
        pool: true,
        maxConnections: 1,
        maxMessages: 10,
        rateLimit: 2,                // 2 emails per second max
      });

      this.initialized = true;
      console.log('Gmail service initialized successfully with timeout handling');
    } catch (error) {
      console.error('Error initializing Gmail service:', error);
    }
  }

  // Method to refresh credentials (useful when settings are updated)
  async refreshCredentials() {
    this.initialized = false;
    this.transporter = null;
    await this.initializeService();
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userType: 'customer' | 'admin' = 'customer'): Promise<boolean> {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Gmail service not initialized');
        return false;
      }

      const resetUrl = userType === 'admin' 
        ? `${process.env.NEXTAUTH_URL}/management-portal/reset-password?token=${resetToken}`
        : `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password for ${this.storeName}.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this reset, please ignore this email.</p>
        </div>
      `;

      const mailOptions = {
        from: `${this.storeName} <${this.fromEmail}>`,
        to: to,
        subject: `Password Reset - ${this.storeName}`,
        html: html,
      };

      // Send email with timeout to prevent hanging
      const result = await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout after 10 seconds')), 10000)
        )
      ]);

      console.log('Password reset email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  async sendOrderConfirmationEmail(order: any): Promise<boolean> {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Gmail service not initialized - skipping email');
        return false;
      }

      // Test connection before sending with timeout
      try {
        await Promise.race([
          this.transporter.verify(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection verification timeout')), 5000)
          )
        ]);
      } catch (verifyError) {
        console.error('Gmail service connection verification failed:', verifyError);
        // Try to refresh credentials once
        await this.refreshCredentials();
        if (!this.transporter) {
          console.warn('Gmail service still not available after refresh');
          return false;
        }
      }

      const customerEmail = order.customerEmail;
      if (!customerEmail) {
        console.error('No customer email provided for order confirmation');
        return false;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🍕 Order Confirmed!</h1>
              <p style="margin: 5px 0 0 0;">Thank you for your order</p>
            </div>

            <div style="padding: 20px;">
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h2 style="margin: 0 0 10px 0; color: #FF6B35;">Order #${order.orderNumber}</h2>
                <p style="margin: 5px 0; color: #666;">Estimated ready time: ${order.estimatedTime || '20-30 minutes'}</p>
                <p style="margin: 5px 0; color: #666;">Order type: ${order.orderType}</p>
              </div>

              <div style="margin: 20px 0;">
                <h3 style="color: #FF6B35; margin-bottom: 10px;">Order Details:</h3>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                  ${order.orderItems?.map((item: any) => `
                    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                      <div style="font-weight: bold;">${item.quantity}x ${item.name || 'Custom Pizza'}</div>
                      <div style="color: #666; font-size: 14px;">${item.pizzaSize?.name || ''} ${item.pizzaCrust?.name || ''} ${item.pizzaSauce?.name || ''}</div>
                      ${item.toppings?.length > 0 ? `<div style="color: #666; font-size: 14px;">Toppings: ${item.toppings.map((t: any) => t.pizzaTopping?.name).join(', ')}</div>` : ''}
                      <div style="font-weight: bold; color: #FF6B35;">$${item.totalPrice?.toFixed(2) || '0.00'}</div>
                    </div>
                  `).join('') || '<p>No items found</p>'}
                </div>
              </div>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Subtotal:</span>
                  <span>$${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                ${order.deliveryFee > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Delivery Fee:</span>
                  <span>$${order.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span>Tax:</span>
                  <span>$${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #FF6B35; border-top: 2px solid #FF6B35; padding-top: 10px;">
                  <span>Total:</span>
                  <span>$${order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <p style="color: #666; font-size: 14px;">Thank you for choosing ${this.storeName}!</p>
                <p style="color: #666; font-size: 14px;">We'll have your order ready soon.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `${this.storeName} <${this.fromEmail}>`,
        to: customerEmail,
        subject: `Order Confirmation #${order.orderNumber} - ${this.storeName}`,
        html: html,
      };

      // Send email with timeout to prevent hanging
      const result = await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout after 10 seconds')), 10000)
        )
      ]);

      console.log('Order confirmation email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.initialized && this.transporter !== null;
  }
}

export const gmailService = new GmailService();
