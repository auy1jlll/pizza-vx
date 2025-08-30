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

    // Add order confirmation email template
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
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                .header { background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                .content { padding: 40px 30px; }
                .order-details { background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
                .order-number { font-size: 24px; font-weight: 700; color: #FF6B35; margin-bottom: 16px; }
                .customer-info { margin: 24px 0; }
                .customer-info h3 { color: #374151; margin-bottom: 12px; font-size: 18px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .info-item { background: #f9fafb; padding: 12px; border-radius: 8px; }
                .info-label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { color: #111827; margin-top: 4px; }
                .items-section { margin: 32px 0; }
                .items-section h3 { color: #374151; margin-bottom: 16px; font-size: 18px; }
                .item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
                .item-name { font-weight: 600; color: #111827; margin-bottom: 8px; }
                .item-details { color: #6b7280; font-size: 14px; line-height: 1.5; }
                .item-price { font-weight: 600; color: #FF6B35; text-align: right; }
                .total-section { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; margin: 24px 0; }
                .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .total-row.final { border-top: 2px solid #e5e7eb; padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: 700; color: #111827; }
                .footer { background-color: #1f2937; color: #9ca3af; padding: 32px 30px; text-align: center; }
                .footer h4 { color: #ffffff; margin-bottom: 16px; }
                .contact-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
                .contact-item { text-align: center; }
                .contact-label { font-weight: 600; color: #d1d5db; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .contact-value { color: #ffffff; margin-top: 4px; }
                .status-badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
                @media (max-width: 600px) {
                  .info-grid { grid-template-columns: 1fr; }
                  .contact-info { grid-template-columns: 1fr; }
                  .header { padding: 30px 20px; }
                  .content { padding: 30px 20px; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🍕 Order Confirmed!</h1>
                  <p>Your delicious pizza is on the way</p>
                </div>

                <div class="content">
                  <div class="order-details">
                    <div class="order-number">{{orderNumber}}</div>
                    <div class="status-badge">{{status}}</div>
                  </div>

                  <div class="customer-info">
                    <h3>📋 Order Details</h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Order Type</div>
                        <div class="info-value">{{orderType}}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Schedule</div>
                        <div class="info-value">{{scheduleType}}</div>
                      </div>
                      {{#if scheduledTime}}
                      <div class="info-item">
                        <div class="info-label">Scheduled For</div>
                        <div class="info-value">{{scheduledTime}}</div>
                      </div>
                      {{/if}}
                      {{#if paymentMethod}}
                      <div class="info-item">
                        <div class="info-label">Payment</div>
                        <div class="info-value">{{paymentMethod}}</div>
                      </div>
                      {{/if}}
                    </div>
                  </div>

                  {{#if deliveryAddress}}
                  <div class="customer-info">
                    <h3>🚚 Delivery Information</h3>
                    <div class="info-item">
                      <div class="info-value">{{deliveryAddress}}</div>
                      {{#if deliveryCity}}
                      <div class="info-value">{{deliveryCity}}, {{deliveryZip}}</div>
                      {{/if}}
                      {{#if deliveryInstructions}}
                      <div class="info-label">Instructions</div>
                      <div class="info-value">{{deliveryInstructions}}</div>
                      {{/if}}
                    </div>
                  </div>
                  {{/if}}

                  <div class="items-section">
                    <h3>🍽️ Your Order</h3>
                    {{#each items}}
                    <div class="item">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                          <div class="item-name">{{quantity}}x {{name}}</div>
                          {{#if notes}}
                          <div class="item-details">{{notes}}</div>
                          {{/if}}
                        </div>
                        <div class="item-price">${{price}}</div>
                      </div>
                    </div>
                    {{/each}}
                  </div>

                  <div class="total-section">
                    <div class="total-row">
                      <span>Subtotal</span>
                      <span>${{subtotal}}</span>
                    </div>
                    {{#if deliveryFee}}
                    <div class="total-row">
                      <span>Delivery Fee</span>
                      <span>${{deliveryFee}}</span>
                    </div>
                    {{/if}}
                    {{#if tipAmount}}
                    <div class="total-row">
                      <span>Tip</span>
                      <span>${{tipAmount}}</span>
                    </div>
                    {{/if}}
                    <div class="total-row">
                      <span>Tax</span>
                      <span>${{tax}}</span>
                    </div>
                    <div class="total-row final">
                      <span>Total</span>
                      <span>${{total}}</span>
                    </div>
                  </div>

                  <div style="text-align: center; margin: 32px 0; padding: 24px; background-color: #f0f9ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <h3 style="color: #1e40af; margin: 0 0 12px 0;">⏰ Estimated Time</h3>
                    <p style="color: #1e40af; margin: 0; font-size: 18px; font-weight: 600;">{{estimatedTime}}</p>
                  </div>
                </div>

                <div class="footer">
                  <h4>Thank you for choosing Greenland Famous Pizza!</h4>
                  <div class="contact-info">
                    <div class="contact-item">
                      <div class="contact-label">Phone</div>
                      <div class="contact-value">(630) 501-0774</div>
                    </div>
                    <div class="contact-item">
                      <div class="contact-label">Email</div>
                      <div class="contact-value">info@greenlandfamous.com</div>
                    </div>
                  </div>
                  <p style="margin: 0; font-size: 14px;">
                    Questions about your order? Give us a call or reply to this email.
                  </p>
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
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                .header { background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                .content { padding: 40px 30px; }
                .order-details { background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
                .order-number { font-size: 24px; font-weight: 700; color: #FF6B35; margin-bottom: 16px; }
                .customer-info { margin: 24px 0; }
                .customer-info h3 { color: #374151; margin-bottom: 12px; font-size: 18px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .info-item { background: #f9fafb; padding: 12px; border-radius: 8px; }
                .info-label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { color: #111827; margin-top: 4px; }
                .items-section { margin: 32px 0; }
                .items-section h3 { color: #374151; margin-bottom: 16px; font-size: 18px; }
                .item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
                .item-name { font-weight: 600; color: #111827; margin-bottom: 8px; }
                .item-details { color: #6b7280; font-size: 14px; line-height: 1.5; }
                .item-price { font-weight: 600; color: #FF6B35; text-align: right; }
                .total-section { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; margin: 24px 0; }
                .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .total-row.final { border-top: 2px solid #e5e7eb; padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: 700; color: #111827; }
                .footer { background-color: #1f2937; color: #9ca3af; padding: 32px 30px; text-align: center; }
                .footer h4 { color: #ffffff; margin-bottom: 16px; }
                .contact-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
                .contact-item { text-align: center; }
                .contact-label { font-weight: 600; color: #d1d5db; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .contact-value { color: #ffffff; margin-top: 4px; }
                .status-badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
                @media (max-width: 600px) {
                  .info-grid { grid-template-columns: 1fr; }
                  .contact-info { grid-template-columns: 1fr; }
                  .header { padding: 30px 20px; }
                  .content { padding: 30px 20px; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🍕 Order Confirmed!</h1>
                  <p>Your delicious pizza is on the way</p>
                </div>

                <div class="content">
                  <div class="order-details">
                    <div class="order-number">{{orderNumber}}</div>
                    <div class="status-badge">{{status}}</div>
                  </div>

                  <div class="customer-info">
                    <h3>📋 Order Details</h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Order Type</div>
                        <div class="info-value">{{orderType}}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Schedule</div>
                        <div class="info-value">{{scheduleType}}</div>
                      </div>
                      {{#if scheduledTime}}
                      <div class="info-item">
                        <div class="info-label">Scheduled For</div>
                        <div class="info-value">{{scheduledTime}}</div>
                      </div>
                      {{/if}}
                      {{#if paymentMethod}}
                      <div class="info-item">
                        <div class="info-label">Payment</div>
                        <div class="info-value">{{paymentMethod}}</div>
                      </div>
                      {{/if}}
                    </div>
                  </div>

                  {{#if deliveryAddress}}
                  <div class="customer-info">
                    <h3>🚚 Delivery Information</h3>
                    <div class="info-item">
                      <div class="info-value">{{deliveryAddress}}</div>
                      {{#if deliveryCity}}
                      <div class="info-value">{{deliveryCity}}, {{deliveryZip}}</div>
                      {{/if}}
                      {{#if deliveryInstructions}}
                      <div class="info-label">Instructions</div>
                      <div class="info-value">{{deliveryInstructions}}</div>
                      {{/if}}
                    </div>
                  </div>
                  {{/if}}

                  <div class="items-section">
                    <h3>🍽️ Your Order</h3>
                    {{#each items}}
                    <div class="item">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                          <div class="item-name">{{quantity}}x {{name}}</div>
                          {{#if notes}}
                          <div class="item-details">{{notes}}</div>
                          {{/if}}
                        </div>
                        <div class="item-price">${{price}}</div>
                      </div>
                    </div>
                    {{/each}}
                  </div>

                  <div class="total-section">
                    <div class="total-row">
                      <span>Subtotal</span>
                      <span>${{subtotal}}</span>
                    </div>
                    {{#if deliveryFee}}
                    <div class="total-row">
                      <span>Delivery Fee</span>
                      <span>${{deliveryFee}}</span>
                    </div>
                    {{/if}}
                    {{#if tipAmount}}
                    <div class="total-row">
                      <span>Tip</span>
                      <span>${{tipAmount}}</span>
                    </div>
                    {{/if}}
                    <div class="total-row">
                      <span>Tax</span>
                      <span>${{tax}}</span>
                    </div>
                    <div class="total-row final">
                      <span>Total</span>
                      <span>${{total}}</span>
                    </div>
                  </div>

                  <div style="text-align: center; margin: 32px 0; padding: 24px; background-color: #f0f9ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <h3 style="color: #1e40af; margin: 0 0 12px 0;">⏰ Estimated Time</h3>
                    <p style="color: #1e40af; margin: 0; font-size: 18px; font-weight: 600;">{{estimatedTime}}</p>
                  </div>
                </div>

                <div class="footer">
                  <h4>Thank you for choosing Greenland Famous Pizza!</h4>
                  <div class="contact-info">
                    <div class="contact-item">
                      <div class="contact-label">Phone</div>
                      <div class="contact-value">(630) 501-0774</div>
                    </div>
                    <div class="contact-item">
                      <div class="contact-label">Email</div>
                      <div class="contact-value">info@greenlandfamous.com</div>
                    </div>
                  </div>
                  <p style="margin: 0; font-size: 14px;">
                    Questions about your order? Give us a call or reply to this email.
                  </p>
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
      console.log(`${setting.key}: ${setting.value}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableEmailNotifications();
