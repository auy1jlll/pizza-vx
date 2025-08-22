const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔍 Which button is not working?');
console.log('Please help identify the specific button:');
console.log();
console.log('1. "Add to Cart" button in menu items');
console.log('2. "Proceed to Checkout" button in cart page');
console.log('3. "Place Order" button in checkout modal');
console.log('4. "Add Employee" button in admin users page');
console.log('5. Other button (please specify)');
console.log();

rl.question('Which button number (1-5) or describe the button: ', (answer) => {
  console.log('\n📋 Thank you! The button issue reported: ', answer);
  
  switch(answer.trim()) {
    case '1':
      console.log('\n🔧 Issue: "Add to Cart" button in menu items');
      console.log('📍 Location: /menu/[category] page');
      console.log('🔍 Checking: addToCart function and /api/menu/format-cart endpoint');
      break;
    case '2':
      console.log('\n🔧 Issue: "Proceed to Checkout" button in cart page');
      console.log('📍 Location: /cart page');
      console.log('🔍 Checking: Button disabled state and verification logic');
      break;
    case '3':
      console.log('\n🔧 Issue: "Place Order" button in checkout modal');
      console.log('📍 Location: CheckoutModal component');
      console.log('🔍 Checking: /api/checkout endpoint and form submission');
      break;
    case '4':
      console.log('\n🔧 Issue: "Add Employee" button in admin users page');
      console.log('📍 Location: /admin/users page');
      console.log('🔍 Checking: Employee creation form and submission');
      break;
    default:
      console.log('\n🔧 Issue: Custom button - "', answer, '"');
      console.log('🔍 Will search for this specific button in the codebase');
  }
  
  console.log('\n✅ Button investigation complete!');
  rl.close();
});
