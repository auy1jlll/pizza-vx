const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

async function testOrderEmail() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Testing order confirmation email...\n');

    // Get Gmail settings
    const gmailUser = await prisma.appSetting.findUnique({
      where: { key: 'gmailUser' }
    });

    const gmailAppPassword = await prisma.appSetting.findUnique({
      where: { key: 'gmailAppPassword' }
    });

    if (!gmailUser?.value || !gmailAppPassword?.value) {
      console.log('❌ Gmail credentials not found');
      return;
    }

    // Create test order data
    const testOrder = {
      orderNumber: 'TEST-12345',
      customerEmail: 'auy1kll@gmail.com', // Using the customer's email from the request
      customerName: 'Test Customer',
      items: [
        {
          name: 'Large Pizza',
          quantity: 1,
          price: 23.50
        }
      ],
      subtotal: 23.50,
      tax: 1.94,
      deliveryFee: 0,
      total: 25.44,
      orderType: 'PICKUP'
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.value,
        pass: gmailAppPassword.value,
      },
    });

    // Create order confirmation email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🍕 Order Confirmed!</h1>
            <p style="margin: 5px 0 0 0;">Thank you for your order</p>
          </div>

          <div style="padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; color: #FF6B35; font-size: 20px;">Order #${testOrder.orderNumber}</h2>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Customer Information</h3>
              <p><strong>Name:</strong> ${testOrder.customerName}</p>
              <p><strong>Email:</strong> ${testOrder.customerEmail}</p>
              <p><strong>Order Type:</strong> ${testOrder.orderType}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Order Items</h3>
              ${testOrder.items.map(item => `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                  <p><strong>${item.name}</strong> x${item.quantity} - $${item.price.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${testOrder.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax:</span>
                <span>$${testOrder.tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Delivery Fee:</span>
                <span>$${testOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; padding-top: 10px; border-top: 2px solid #FF6B35;">
                <span>Total:</span>
                <span>$${testOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #666;">
              <p>Thank you for choosing Greenland Famous Pizza! 🍕</p>
              <p>This is a test email sent at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Greenland Famous Pizza" <${gmailUser.value}>`,
      to: testOrder.customerEmail,
      subject: `Order Confirmation #${testOrder.orderNumber} - Greenland Famous Pizza`,
      html,
    };

    console.log('📧 Sending order confirmation email...');
    console.log(`📨 To: ${testOrder.customerEmail}`);
    console.log(`📨 From: ${gmailUser.value}`);

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully!');
    console.log(`📨 Message ID: ${info.messageId}`);

    console.log('\n🎊 Test completed successfully!');
    console.log('If you receive this email, the order confirmation system is working.');

  } catch (error) {
    console.error('❌ Error testing order email:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderEmail();
