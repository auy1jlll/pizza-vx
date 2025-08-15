// Test OrderService import
console.log('Testing OrderService import...');

try {
  const { OrderService } = require('./src/services/index.js');
  console.log('✅ OrderService imported successfully');
  console.log('OrderService:', typeof OrderService);
  
  const instance = new OrderService();
  console.log('✅ OrderService instance created successfully');
  console.log('Instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
  
} catch (error) {
  console.error('❌ OrderService import failed:', error.message);
  console.error('Full error:', error);
}
