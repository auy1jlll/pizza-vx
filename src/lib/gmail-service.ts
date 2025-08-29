import nodemailer from 'nodemailer';

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

  constructor() {
    this.fromEmail = process.env.GMAIL_USER || '';
    this.storeName = process.env.STORE_NAME || 'Greenland Famous Pizza';

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not found. Email service will not work.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userType: 'customer' | 'admin' = 'customer'): Promise<boolean> {
    try {
      if (!this.transporter) return false;

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
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<boolean> {
    try {
      if (!this.transporter) return false;

      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to,
        subject: 'Test Email',
        html: '<h1>Test Email</h1><p>Gmail service is working!</p>',
      });

      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && this.transporter);
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
