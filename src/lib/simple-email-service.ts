import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

interface EmailConfig {
  from_name: string;
  from_email: string;
  reply_to: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  website_url: string;
  support_email: string;
}

interface EmailTemplate {
  name: string;
  subject: string;
  variables: string[];
  html_content: string;
  text_content: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

export class SimpleConfigurableEmailService {
  private static resend: Resend | null = null;
  private static config: EmailConfig | null = null;
  private static templates: Record<string, EmailTemplate> = {};
  private static isInitialized = false;

  private static async initialize() {
    if (this.isInitialized) return;

    // Initialize Resend client
    const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY or SMTP_PASS environment variable is required');
    }
    this.resend = new Resend(apiKey);

    // Load configuration and templates from JSON
    await this.loadConfigFromJson();
    await this.loadTemplatesFromJson();
    
    this.isInitialized = true;
    console.log('✅ Simple Configurable Email Service initialized');
  }

  private static async loadConfigFromJson() {
    try {
      const configPath = path.join(process.cwd(), 'config', 'email-config.json');
      const configFile = fs.readFileSync(configPath, 'utf8');
      const jsonConfig = JSON.parse(configFile);
      this.config = jsonConfig.email_settings;
      console.log('📧 Email configuration loaded from JSON file');
    } catch (error) {
      console.error('❌ Could not load email configuration:', error);
      // Use default config
      this.config = {
        from_name: 'Boston Pizza',
        from_email: 'noreply@resend.dev',
        reply_to: 'support@example.com',
        company_name: 'Boston Pizza',
        company_address: '123 Pizza Street',
        company_phone: '(555) 123-PIZZA',
        website_url: process.env.NEXTAUTH_URL || 'http://localhost:3005',
        support_email: 'support@example.com'
      };
    }
  }

  private static async loadTemplatesFromJson() {
    try {
      const configPath = path.join(process.cwd(), 'config', 'email-config.json');
      const configFile = fs.readFileSync(configPath, 'utf8');
      const jsonConfig = JSON.parse(configFile);
      this.templates = jsonConfig.email_templates;
      console.log('📧 Email templates loaded from JSON file');
    } catch (error) {
      console.error('❌ Could not load email templates:', error);
      this.templates = {};
    }
  }

  private static renderTemplate(templateContent: string, variables: Record<string, any>): string {
    try {
      const template = Handlebars.compile(templateContent);
      return template({ ...this.config, ...variables });
    } catch (error) {
      console.error('❌ Template rendering error:', error);
      return templateContent;
    }
  }

  // Password Reset Email
  static async sendPasswordResetEmail(to: string, resetLink: string, userName?: string): Promise<boolean> {
    await this.initialize();
    
    const templateKey = 'password_reset';
    const template = this.templates[templateKey];
    
    if (!template) {
      console.error(`❌ Template '${templateKey}' not found`);
      return false;
    }

    const variables = {
      name: userName,
      reset_link: resetLink,
      expiry_hours: '1'
    };

    const subject = this.renderTemplate(template.subject, variables);
    const html = this.renderTemplate(template.html_content, variables);
    const text = this.renderTemplate(template.text_content, variables);

    return this.sendEmail(to, subject, html, text);
  }

  // Account Confirmation Email
  static async sendAccountConfirmationEmail(to: string, confirmationLink: string, userName?: string, username?: string): Promise<boolean> {
    await this.initialize();
    
    const templateKey = 'account_confirmation';
    const template = this.templates[templateKey];
    
    if (!template) {
      console.error(`❌ Template '${templateKey}' not found`);
      return false;
    }

    const variables = {
      name: userName,
      username: username,
      confirmation_link: confirmationLink
    };

    const subject = this.renderTemplate(template.subject, variables);
    const html = this.renderTemplate(template.html_content, variables);
    const text = this.renderTemplate(template.text_content, variables);

    return this.sendEmail(to, subject, html, text);
  }

  // Order Confirmation Email
  static async sendOrderConfirmationEmail(
    to: string, 
    orderNumber: string, 
    total: string, 
    orderItems: OrderItem[],
    orderType: string,
    pickupTime?: string,
    customerName?: string
  ): Promise<boolean> {
    await this.initialize();
    
    const templateKey = 'order_confirmation';
    const template = this.templates[templateKey];
    
    if (!template) {
      console.error(`❌ Template '${templateKey}' not found`);
      return false;
    }

    const variables = {
      name: customerName,
      order_number: orderNumber,
      total: total,
      order_items: orderItems,
      order_type: orderType,
      pickup_time: pickupTime,
      order_date: new Date().toLocaleDateString()
    };

    const subject = this.renderTemplate(template.subject, variables);
    const html = this.renderTemplate(template.html_content, variables);
    const text = this.renderTemplate(template.text_content, variables);

    return this.sendEmail(to, subject, html, text);
  }

  // Order Ready Email
  static async sendOrderReadyEmail(to: string, orderNumber: string, customerName?: string): Promise<boolean> {
    await this.initialize();
    
    const templateKey = 'order_ready';
    const template = this.templates[templateKey];
    
    if (!template) {
      console.error(`❌ Template '${templateKey}' not found`);
      return false;
    }

    const variables = {
      name: customerName,
      order_number: orderNumber
    };

    const subject = this.renderTemplate(template.subject, variables);
    const html = this.renderTemplate(template.html_content, variables);
    const text = this.renderTemplate(template.text_content, variables);

    return this.sendEmail(to, subject, html, text);
  }

  // Generic Email Sender
  private static async sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
    if (!this.resend || !this.config) {
      console.error('❌ Email service not initialized');
      return false;
    }

    try {
      console.log(`📧 Sending email to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 From: ${this.config.from_name} <${this.config.from_email}>`);

      const { data, error } = await this.resend.emails.send({
        from: `${this.config.from_name} <${this.config.from_email}>`,
        to: [to],
        subject,
        html,
        text,
        replyTo: this.config.reply_to
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

  // Test method for development
  static async testEmail(to: string): Promise<boolean> {
    return this.sendEmail(
      to,
      'Test Email from Boston Pizza',
      '<h1>Test Email</h1><p>This is a test email from Boston Pizza!</p>',
      'Test Email - This is a test email from Boston Pizza!'
    );
  }
}

export default SimpleConfigurableEmailService;
