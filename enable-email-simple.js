const { PrismaClient } = require('@prisma/client');

async function enableEmailNotifications() {
  const prisma = new PrismaClient();

  try {
    // Enable email notifications
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: {
        key: 'emailNotifications',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    console.log('✅ Email notifications enabled');

    // Add a simple order confirmation email template
    await prisma.appSetting.upsert({
      where: { key: 'orderConfirmationTemplate' },
      update: {
        value: JSON.stringify({
          subject: 'Order Confirmation - {{orderNumber}}',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Order Confirmation</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .order-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .total { font-size: 18px; font-weight: bold; color: #FF6B35; text-align: center; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🍕 Order Confirmed!</h1>
                  <p>Thank you for your order</p>
                </div>

                <div class="content">
                  <div class="order-info">
                    <h2>Order #{{orderNumber}}</h2>
                    <p><strong>Status:</strong> {{status}}</p>
                    <p><strong>Type:</strong> {{orderType}}</p>
                    <p><strong>Items:</strong> {{itemCount}} items</p>
                  </div>

                  <div class="total">
                    Total: ${{total}}
                  </div>

                  {{#if estimatedTime}}
                  <div class="order-info">
                    <p><strong>Estimated Time:</strong> {{estimatedTime}}</p>
                  </div>
                  {{/if}}

                  <div class="order-info">
                    <p>We'll send you updates as your order progresses.</p>
                    <p>Questions? Call us at (630) 501-0774</p>
                  </div>
                </div>

                <div class="footer">
                  <p>Greenland Famous Pizza - Authentic pizza since 1995</p>
                </div>
              </div>
            </body>
            </html>
          `
        })
      },
      create: {
        key: 'orderConfirmationTemplate',
        value: JSON.stringify({
          subject: 'Order Confirmation - {{orderNumber}}',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Order Confirmation</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .order-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .total { font-size: 18px; font-weight: bold; color: #FF6B35; text-align: center; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🍕 Order Confirmed!</h1>
                  <p>Thank you for your order</p>
                </div>

                <div class="content">
                  <div class="order-info">
                    <h2>Order #{{orderNumber}}</h2>
                    <p><strong>Status:</strong> {{status}}</p>
                    <p><strong>Type:</strong> {{orderType}}</p>
                    <p><strong>Items:</strong> {{itemCount}} items</p>
                  </div>

                  <div class="total">
                    Total: ${{total}}
                  </div>

                  {{#if estimatedTime}}
                  <div class="order-info">
                    <p><strong>Estimated Time:</strong> {{estimatedTime}}</p>
                  </div>
                  {{/if}}

                  <div class="order-info">
                    <p>We'll send you updates as your order progresses.</p>
                    <p>Questions? Call us at (630) 501-0774</p>
                  </div>
                </div>

                <div class="footer">
                  <p>Greenland Famous Pizza - Authentic pizza since 1995</p>
                </div>
              </div>
            </body>
            </html>
          `
        }),
        type: 'JSON'
      }
    });

    console.log('✅ Order confirmation email template added');

    // Verify the settings
    const settings = await prisma.appSetting.findMany({
      where: {
        OR: [
          { key: 'emailNotifications' },
          { key: 'orderConfirmationTemplate' }
        ]
      }
    });

    console.log('\n📧 Email Settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value.substring(0, 100)}...`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableEmailNotifications();
