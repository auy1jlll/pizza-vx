const QRCode = require('qrcode');
const fs = require('fs');

async function generateQR() {
  try {
    // Generate QR code for the network URL
    const url = 'http://172.31.48.1:3004';

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#dc2626', // Red color to match pizza theme
        light: '#ffffff'
      }
    });

    // Save to file
    fs.writeFileSync('pizza-pwa-qr-code.png', qrCodeBuffer);

    console.log('✅ QR Code generated successfully!');
    console.log('📁 File saved as: pizza-pwa-qr-code.png');
    console.log('🌐 URL encoded:', url);
    console.log('📱 Scan this QR code with your phone to access the Pizza PWA!');

  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

generateQR();