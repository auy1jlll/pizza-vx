import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class ResendEmailService {
  private static resend: Resend | null = null;

  private static getResendClient(): Resend {
    if (this.resend) {
      return this.resend;
    }

    const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY or SMTP_PASS environment variable is required');
    }

    this.resend = new Resend(apiKey);
    return this.resend;
  }

  static async sendPasswordResetEmail(to: string, resetLink: string, userName?: string): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'resto@greenlandfamous.net';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍕 Boston Pizza</h1>
          </div>
          
          <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #e53e3e; margin-top: 0;">Password Reset Request</h2>
            
            ${userName ? `<p>Hi ${userName},</p>` : '<p>Hello,</p>'}
            
            <p>We received a request to reset your password for your Boston Pizza account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #e53e3e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              If the button above doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #e53e3e; word-break: break-all;">${resetLink}</a>
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              © 2025 Boston Pizza. All rights reserved.<br>
              This email was sent to ${to}
            </p>
          </div>
        </body>
        </html>
      `;

      const textContent = `
        Password Reset Request - Boston Pizza

        ${userName ? `Hi ${userName},` : 'Hello,'}

        We received a request to reset your password for your Boston Pizza account.

        Click this link to reset your password: ${resetLink}

        This link will expire in 1 hour for security reasons.

        If you didn't request this password reset, please ignore this email.

        © 2025 Boston Pizza. All rights reserved.
      `;

      const result = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject: 'Password Reset Request - Boston Pizza',
        html: htmlContent,
        text: textContent,
      });

      console.log(`✅ Password reset email sent successfully to ${to}. Email ID: ${result.data?.id}`);
      return true;

    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return false;
    }
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const resend = this.getResendClient();
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'resto@greenlandfamous.net';
      const fromName = process.env.SMTP_FROM_NAME || 'Boston Pizza';

      const result = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`✅ Email sent successfully to ${options.to}. Email ID: ${result.data?.id}`);
      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }
}
