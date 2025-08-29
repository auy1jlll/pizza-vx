import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const prisma = new PrismaClient();

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

export class ConfigurableEmailService {
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

    // Load configuration from database first, then fallback to JSON
    await this.loadConfiguration();
    await this.loadTemplates();
    
    this.isInitialized = true;
    console.log('✅ Configurable Email Service initialized');
  }

  private static async loadConfiguration() {
    try {
      // Try to load from database first
      const dbSettings = await prisma.emailSettings.findMany();
      
      if (dbSettings.length > 0) {
        // Convert database settings to config object
        this.config = dbSettings.reduce((acc, setting) => {
          acc[setting.settingKey as keyof EmailConfig] = setting.settingValue;
          return acc;
        }, {} as any);
        console.log('📧 Email configuration loaded from database');
      } else {
        // Fallback to JSON file
        await this.loadConfigFromJson();
      }
    } catch (error) {
      console.warn('⚠️ Could not load email config from database, using JSON fallback:', error);
      await this.loadConfigFromJson();
    }
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

  private static async loadTemplates() {
    try {
      // Try to load from database first
      const dbTemplates = await prisma.emailTemplate.findMany({
        where: { isActive: true }
      });

      if (dbTemplates.length > 0) {
        // Convert database templates to templates object
        this.templates = dbTemplates.reduce((acc, template) => {
          acc[template.templateKey] = {
            name: template.name,
            subject: template.subject,
            variables: template.variables,
            html_content: template.htmlContent,
            text_content: template.textContent || ''
          };
          return acc;
        }, {} as Record<string, EmailTemplate>);
        console.log('📧 Email templates loaded from database');
      } else {
        // Fallback to JSON file
        await this.loadTemplatesFromJson();
      }
    } catch (error) {
      console.warn('⚠️ Could not load email templates from database, using JSON fallback:', error);
      await this.loadTemplatesFromJson();
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

  private static async logEmail(to: string, subject: string, templateKey?: string, status: 'PENDING' | 'SENT' | 'FAILED' = 'PENDING', errorMessage?: string, emailId?: string) {
    try {
      await prisma.emailLog.create({
        data: {
          to,
          subject,
          templateKey,
          status,
          errorMessage,
          emailId,
          sentAt: status === 'SENT' ? new Date() : null
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not log email:', error);
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

    return this.sendEmail(to, subject, html, text, templateKey);
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

    return this.sendEmail(to, subject, html, text, templateKey);
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

    return this.sendEmail(to, subject, html, text, templateKey);
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

    return this.sendEmail(to, subject, html, text, templateKey);
  }

  // Generic Email Sender
  private static async sendEmail(to: string, subject: string, html: string, text: string, templateKey?: string): Promise<boolean> {
    if (!this.resend || !this.config) {
      console.error('❌ Email service not initialized');
      return false;
    }

    // Log email as pending
    await this.logEmail(to, subject, templateKey, 'PENDING');

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
        await this.logEmail(to, subject, templateKey, 'FAILED', error.message);
        return false;
      }

      console.log('✅ Email sent successfully!');
      console.log('📧 Email ID:', data?.id);
      await this.logEmail(to, subject, templateKey, 'SENT', undefined, data?.id);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to send email:', error);
      await this.logEmail(to, subject, templateKey, 'FAILED', errorMessage);
      return false;
    }
  }

  // Admin function to sync templates from JSON to database
  static async syncTemplatesToDatabase(): Promise<void> {
    await this.initialize();
    
    try {
      const configPath = path.join(process.cwd(), 'config', 'email-config.json');
      const configFile = fs.readFileSync(configPath, 'utf8');
      const jsonConfig = JSON.parse(configFile);

      for (const [templateKey, template] of Object.entries(jsonConfig.email_templates)) {
        const templateData = template as EmailTemplate;
        
        await prisma.emailTemplate.upsert({
          where: { templateKey },
          update: {
            name: templateData.name,
            subject: templateData.subject,
            htmlContent: templateData.html_content,
            textContent: templateData.text_content,
            variables: templateData.variables,
            updatedAt: new Date()
          },
          create: {
            templateKey,
            name: templateData.name,
            subject: templateData.subject,
            htmlContent: templateData.html_content,
            textContent: templateData.text_content,
            variables: templateData.variables
          }
        });
      }

      console.log('✅ Email templates synced to database');
    } catch (error) {
      console.error('❌ Failed to sync templates to database:', error);
    }
  }

  // Admin function to sync settings from JSON to database
  static async syncSettingsToDatabase(): Promise<void> {
    await this.initialize();
    
    try {
      const configPath = path.join(process.cwd(), 'config', 'email-config.json');
      const configFile = fs.readFileSync(configPath, 'utf8');
      const jsonConfig = JSON.parse(configFile);

      for (const [settingKey, settingValue] of Object.entries(jsonConfig.email_settings)) {
        await prisma.emailSettings.upsert({
          where: { settingKey },
          update: {
            settingValue: settingValue as string,
            updatedAt: new Date()
          },
          create: {
            settingKey,
            settingValue: settingValue as string,
            description: `Email setting: ${settingKey}`,
            category: 'general'
          }
        });
      }

      console.log('✅ Email settings synced to database');
    } catch (error) {
      console.error('❌ Failed to sync settings to database:', error);
    }
  }
}

export default ConfigurableEmailService;
