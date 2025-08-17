// Cleanup script to remove unnecessary test files and development artifacts
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup of unnecessary test files...');

// Files to delete from root directory
const rootFilesToDelete = [
  // Test files
  'test-admin-login.js',
  'test-api-performance.mjs',
  'test-api-simple.mjs',
  'test-api-validation.mjs',
  'test-both-checkout-systems.js',
  'test-brute-force-protection.js',
  'test-cart-fix.js',
  'test-checkout-api.js',
  'test-checkout-debug.js',
  'test-checkout-final.js',
  'test-checkout-fix.js',
  'test-checkout-fix.json',
  'test-checkout-simple.js',
  'test-checkout-validation.js',
  'test-complete-architecture.js',
  'test-connectivity.js',
  'test-correct-order.json',
  'test-correct-pricing.js',
  'test-db-indices.js',
  'test-debug-checkout.js',
  'test-detailed-order.js',
  'test-dynamic-tax-checkout.js',
  'test-dynamic-tax.js',
  'test-enhanced-checkout.js',
  'test-frontend-checkout.js',
  'test-jwt-direct.mjs',
  'test-jwt-improvements.js',
  'test-jwt-improvements.mjs',
  'test-login-api.js',
  'test-login-debug.js',
  'test-login-fix.js',
  'test-minimal-checkout.js',
  'test-new-login-fix.js',
  'test-normalization.js',
  'test-order-history.js',
  'test-order-validation.js',
  'test-order.json',
  'test-orderservice.js',
  'test-password.js',
  'test-performance.mjs',
  'test-pricing-snapshots.js',
  'test-rate-limiting.js',
  'test-server-basic.js',
  'test-service-architecture.js',
  'test-service-imports.mjs',
  'test-services.mjs',
  'test-settings.js',
  'test-simple-login.js',
  'test-specialty-data.js',
  'test-unified-cart.js',
  'test-zod-validation.js',
  
  // Development/debug files
  'debug-cart.js',
  'pricing-debug.js',
  'quick-api-test.js',
  'implementation-summary.js',
  
  // Old/unused setup files
  'add-pricing-settings.js',
  'add-tip-payment-settings.js',
  'check-components.js',
  'check-real-ids.js',
  'create-test-customer.js',
  'create-test-image.js',
  'create-test-kitchen-orders.js',
  'reference-admin-script.js',
  
  // Image file
  'test-pizza.png'
];

// Directories to delete from src
const srcDirectoriesToDelete = [
  'src/app/test-schemas',
  'src/services/order-broken.ts',
  'src/services/order-clean.ts',
  'src/services/order-new.ts',
  'src/services/order.ts.backup'
];

// Components to delete (duplicates/unused)
const componentsToDelete = [
  'src/components/EnhancedCheckout.tsx',
  'src/components/SimpleCheckout.tsx',
  'src/components/UnifiedCart-Enhanced.tsx',
  'src/components/UnifiedCart.tsx',
  'src/components/Toast.tsx',
  'src/components/ToastContainer.tsx'
];

// API routes to delete (old/test versions)
const apiRoutesToDelete = [
  'src/app/api/checkout-test',
  'src/app/api/checkout/route-new.ts',
  'src/app/api/checkout/route-old.ts',
  'src/app/api/test'
];

// CSS files to delete (old versions)
const cssFilesToDelete = [
  'src/app/globals_enhanced.css',
  'src/app/globals_new.css',
  'src/app/globals_old.css'
];

// Contexts to delete (unused)
const contextsToDelete = [
  'src/contexts/ToastContext.tsx'
];

let deletedCount = 0;

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`📁 Deleted directory: ${filePath}`);
      } else {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted file: ${filePath}`);
      }
      deletedCount++;
      return true;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${filePath}:`, error.message);
    return false;
  }
}

// Delete root files
console.log('\n🗑️  Deleting root test files...');
rootFilesToDelete.forEach(file => {
  deleteFile(file);
});

// Delete src directories and files
console.log('\n🗑️  Deleting src test files...');
srcDirectoriesToDelete.forEach(file => {
  deleteFile(file);
});

// Delete unused components
console.log('\n🗑️  Deleting unused components...');
componentsToDelete.forEach(file => {
  deleteFile(file);
});

// Delete old API routes
console.log('\n🗑️  Deleting old API routes...');
apiRoutesToDelete.forEach(file => {
  deleteFile(file);
});

// Delete old CSS files
console.log('\n🗑️  Deleting old CSS files...');
cssFilesToDelete.forEach(file => {
  deleteFile(file);
});

// Delete unused contexts
console.log('\n🗑️  Deleting unused contexts...');
contextsToDelete.forEach(file => {
  deleteFile(file);
});

console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} files/directories.`);
console.log('📁 Remaining files are production-ready code.');
