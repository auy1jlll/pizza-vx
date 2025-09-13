// Permanent fix for menu categories display issue
// This script will create a proper solution that persists

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating permanent fix for menu categories display...');

// Read the current menu page
const menuPagePath = path.join(__dirname, 'src/app/menu/page.tsx');
let menuContent = fs.readFileSync(menuPagePath, 'utf8');

// Create the fixed version with proper filtering
const fixedContent = menuContent.replace(
  /setCategories\(result\.data\);/,
  `// Filter to show only categories with menu items (direct or in subcategories)
          const categoriesWithItems = result.data.filter((category: any) => {
            const hasDirectItems = (category._count?.menuItems || 0) > 0;
            const hasSubcategoryItems = (category.subcategories || []).some((sub: any) => (sub._count?.menuItems || 0) > 0);
            return hasDirectItems || hasSubcategoryItems;
          });

          console.log(\`🎯 Showing \${categoriesWithItems.length} categories with menu items\`);
          setCategories(categoriesWithItems);`
);

// Also remove the debug text we added
const cleanedContent = fixedContent.replace(
  'Browse by Category (DEBUG MODE - Fixed Filtering)',
  'Browse by Category'
);

// Write the fixed file
fs.writeFileSync(menuPagePath, cleanedContent);

console.log('✅ Fixed menu page with permanent filtering');

// Create deployment script
const deployScript = `#!/bin/bash
# Permanent deployment script for menu categories fix

echo "🚀 Deploying permanent menu categories fix..."

# Upload the fixed menu page
scp -i "C:\\Users\\auy1j\\.ssh\\new_hetzner_key" "C:\\Users\\auy1j\\Desktop\\final\\src\\app\\menu\\page.tsx" root@91.99.58.154:/opt/greenland-pizza/src/app/menu/

# Restart the application
ssh -i "C:\\Users\\auy1j\\.ssh\\new_hetzner_key" root@91.99.58.154 "cd /opt/greenland-pizza && docker-compose restart typescript-app"

echo "✅ Menu categories fix deployed permanently"
echo "📋 Users should now see all categories that have menu items"
echo "🔄 Changes will persist across container restarts"
`;

fs.writeFileSync(path.join(__dirname, 'deploy-menu-fix.sh'), deployScript);

console.log('✅ Created deployment script: deploy-menu-fix.sh');
console.log('');
console.log('🎯 PERMANENT SOLUTION SUMMARY:');
console.log('✅ Fixed menu page to filter categories properly');
console.log('✅ Users will see categories with menu items (direct or subcategories)');
console.log('✅ Empty categories will be hidden');
console.log('✅ Changes will persist across restarts');
console.log('');
console.log('🚀 Run: bash deploy-menu-fix.sh to deploy permanently');