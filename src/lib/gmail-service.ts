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
        gmailUser = process.env.GMAIL_USER || '';
      }
      if (!gmailAppPassword) {
        gmailAppPassword = process.env.GMAIL_APP_PASSWORD || '';
      }

      this.fromEmail = gmailUser;

      if (!gmailUser || !gmailAppPassword) {
        console.warn('Gmail credentials not found in database or environment. Email service will not work.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      this.initialized = true;
      console.log('Gmail service initialized successfully');
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

      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to,
        subject: 'Password Reset Request',
        html,
      });

      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      
      // Handle auth errors gracefully
      if (error instanceof Error && error.message.includes('EAUTH')) {
        console.warn('Gmail authentication failed for password reset');
        this.initialized = false;
        this.transporter = null;
      }
      
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<boolean> {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Gmail service not initialized');
        return false;
      }

      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to,
        subject: 'Test Email',
        html: '<h1>Test Email</h1><p>Gmail service is working!</p>',
      });

      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      
      // Handle auth errors gracefully
      if (error instanceof Error && error.message.includes('EAUTH')) {
        console.warn('Gmail authentication failed for test email');
        this.initialized = false;
        this.transporter = null;
      }
      
      return false;
    }
  }

  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Gmail service not initialized');
        return false;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${this.storeName}! 🍕</h2>
          <p>Hi ${userName},</p>
          <p>Welcome to our pizza family! We're excited to serve you delicious pizzas and amazing food.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our full menu</li>
            <li>Place orders online</li>
            <li>Track your orders</li>
            <li>Save your favorite pizzas</li>
          </ul>
          <p>Thanks for choosing ${this.storeName}!</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to,
        subject: `Welcome to ${this.storeName}! 🍕`,
        html,
      });

      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      
      // Handle auth errors gracefully
      if (error instanceof Error && error.message.includes('EAUTH')) {
        console.warn('Gmail authentication failed for welcome email');
        this.initialized = false;
        this.transporter = null;
      }
      
      return false;
    }
  }

  async sendOrderConfirmationEmail(order: any): Promise<boolean> {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Gmail service not initialized - skipping email');
        return false;
      }

      // Test connection before sending
      try {
        await this.transporter.verify();
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
                <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${order.orderType}</p>
                <p style="margin: 5px 0;"><strong>Items:</strong> ${order.orderItems?.length || 0} items</p>
              </div>

              <div style="text-align: center; font-size: 18px; font-weight: bold; color: #FF6B35; margin: 20px 0; padding: 15px; background-color: #fff5f5; border-radius: 5px;">
                Total: $${order.total?.toFixed(2)}
              </div>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p style="margin: 0;">We'll send you updates as your order progresses.</p>
                <p style="margin: 10px 0 0 0;">Questions? Call us at (630) 501-0774</p>
              </div>
            </div>

            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0;">Greenland Famous Pizza - Authentic pizza since 1995</p>
            </div>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to: customerEmail,
        subject: `Order Confirmation #${order.orderNumber} - ${this.storeName}`,
        html,
      });

      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      
      // Specific handling for authentication errors
      if (error instanceof Error) {
        if (error.message.includes('Username and Password not accepted') ||
            error.message.includes('Invalid login') ||
            error.message.includes('EAUTH')) {
          console.warn('Gmail authentication failed - credentials may be invalid');
          // Mark service as not initialized to prevent further attempts
          this.initialized = false;
          this.transporter = null;
        }
      }
      
      return false;
    }
  }

  isConfigured(): boolean {
    return this.initialized && !!this.transporter;
  }

  getServiceInfo() {
    return {
      configured: this.isConfigured(),
      fromEmail: this.fromEmail,
      storeName: this.storeName,
    };
  }
}

export const gmailService = new GmailService();
export default gmailService;
