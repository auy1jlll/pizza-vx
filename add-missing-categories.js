// Script to add missing menu categories to production database
// This fixes the issue where not all categories are showing in the menu

const fs = require('fs');
const path = require('path');

console.log('🍕 Adding missing menu categories to fix menu display issue...');

const missingCategories = [
  {
    name: 'Pizza',
    slug: 'pizza',
    description: 'Build your own pizza with fresh ingredients and premium toppings',
    sortOrder: 1
  },
  {
    name: 'Specialty Pizzas',
    slug: 'specialty-pizzas',
    description: 'Our signature gourmet pizzas with unique flavor combinations',
    sortOrder: 2
  },
  {
    name: 'Calzones',
    slug: 'calzones',
    description: 'Build your own calzone with fresh ingredients baked in our stone oven',
    sortOrder: 3
  },
  {
    name: 'Pasta',
    slug: 'pasta',
    description: 'Traditional Italian pasta dishes with authentic sauces',
    sortOrder: 10
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Refreshing drinks, sodas, and specialty beverages',
    sortOrder: 20
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    description: 'Sweet treats and traditional Italian desserts',
    sortOrder: 21
  }
];

// Generate SQL for inserting missing categories
const insertStatements = missingCategories.map(category => {
  const id = `cat_${category.slug.replace(/-/g, '_')}_${Date.now()}`;
  return `INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('${id}', '${category.name}', '${category.slug}', '${category.description}', true, ${category.sortOrder}, NOW(), NOW());`;
}).join('\n');

const sqlScript = `-- Add missing menu categories to fix menu display issue
-- Generated on ${new Date().toISOString()}

${insertStatements}

-- Update existing categories sort order to make room
UPDATE menu_categories SET "sortOrder" = "sortOrder" + 10 WHERE "sortOrder" >= 10;

-- Verify categories were added
SELECT id, name, slug, "sortOrder" FROM menu_categories ORDER BY "sortOrder";
`;

// Write SQL script
const sqlFilePath = path.join(__dirname, 'add-missing-categories.sql');
fs.writeFileSync(sqlFilePath, sqlScript);

console.log('✅ Generated SQL script: add-missing-categories.sql');
console.log('');
console.log('🔧 PRODUCTION FIX STEPS:');
console.log('1. Upload this script to production server');
console.log('2. Run: docker exec postgres-db psql -U postgres -d resto_app_prod -f /opt/greenland-pizza/add-missing-categories.sql');
console.log('3. Restart the app: docker-compose restart typescript-app');
console.log('4. Verify menu categories are now displaying properly');
console.log('');
console.log('📋 Categories being added:');
missingCategories.forEach(cat => {
  console.log(`   • ${cat.name} (${cat.slug}) - ${cat.description}`);
});
console.log('');
console.log('🎯 This will fix the issue where users see fewer menu categories than expected!');