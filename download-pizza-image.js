const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('📥 Downloading pizza image from Greenland Famous...');

const imageUrl = 'https://greenlandfamous.com/wp-content/uploads/2020/12/tomato-2.jpg';
const outputPath = path.join(__dirname, 'public', 'pizza-hero.jpg');

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const file = fs.createWriteStream(outputPath);

https.get(imageUrl, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log('✅ Pizza image downloaded successfully!');
      console.log(`📍 Saved to: ${outputPath}`);
      
      // Check file size
      const stats = fs.statSync(outputPath);
      console.log(`📊 File size: ${(stats.size / 1024).toFixed(1)} KB`);
    });
  } else {
    console.error(`❌ Failed to download image. Status: ${response.statusCode}`);
    fs.unlinkSync(outputPath);
  }
}).on('error', (err) => {
  console.error('❌ Download error:', err.message);
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }
});
