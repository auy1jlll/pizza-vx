const fs = require('fs');
const path = require('path');

// Create a test image file (simple 1x1 pixel PNG) 
const testImage = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
  0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x9A, 0x96, 0x82, 0xD0, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

const testImagePath = path.join(__dirname, 'test-pizza.png');
fs.writeFileSync(testImagePath, testImage);

console.log('✅ Test image created at:', testImagePath);
console.log('📝 You can now test the image upload feature in the admin panel!');
console.log('🍕 Go to: http://localhost:3002/admin/specialty-pizzas');
console.log('   1. Click "Add New Pizza" or edit an existing pizza');
console.log('   2. Use "Choose Image File" to upload the test-pizza.png file');
console.log('   3. The image should upload and show a preview');

// Also create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'specialty-pizzas');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}
