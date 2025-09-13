const fs = require('fs');
const path = require('path');

// Create SVG icon that can be used as base for PWA icons
const pizzaIconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="256" fill="#dc2626"/>

  <!-- Pizza Base -->
  <circle cx="256" cy="256" r="200" fill="#f59e0b"/>

  <!-- Pizza Crust -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#d97706" stroke-width="8"/>

  <!-- Cheese -->
  <circle cx="256" cy="256" r="180" fill="#fbbf24"/>

  <!-- Pepperoni -->
  <circle cx="200" cy="200" r="25" fill="#dc2626"/>
  <circle cx="300" cy="180" r="20" fill="#dc2626"/>
  <circle cx="280" cy="260" r="22" fill="#dc2626"/>
  <circle cx="180" cy="280" r="18" fill="#dc2626"/>
  <circle cx="320" cy="300" r="24" fill="#dc2626"/>
  <circle cx="230" cy="320" r="20" fill="#dc2626"/>

  <!-- Green Peppers -->
  <ellipse cx="220" cy="240" rx="15" ry="8" fill="#16a34a"/>
  <ellipse cx="290" cy="220" rx="12" ry="6" fill="#16a34a"/>
  <ellipse cx="260" cy="300" rx="14" ry="7" fill="#16a34a"/>

  <!-- Text -->
  <text x="256" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">GREENLAND</text>
  <text x="256" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">PIZZA</text>
</svg>`;

// Save the SVG icon
const svgPath = path.join(__dirname, 'public', 'icons', 'pizza-icon.svg');
fs.writeFileSync(svgPath, pizzaIconSvg);

console.log('✅ PWA Icon generated: public/icons/pizza-icon.svg');
console.log('📱 To complete PWA setup:');
console.log('1. Convert the SVG to PNG icons in required sizes using an online converter');
console.log('2. Or use a tool like @capacitor/assets to generate all icon sizes');
console.log('');
console.log('Required icon sizes:');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach(size => {
  console.log(`   - icon-${size}x${size}.png`);
});

console.log('');
console.log('🎯 PWA Features Added:');
console.log('✅ manifest.json with app shortcuts');
console.log('✅ Pizza-themed branding');
console.log('✅ Standalone app display');
console.log('📋 Next: Service worker for offline functionality');