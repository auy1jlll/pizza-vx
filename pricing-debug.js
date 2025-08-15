// Test script to verify pizza pricing fix
// Run this in the browser console when testing specialty pizzas

console.log('🍕 Pizza Pricing Debug Helper');
console.log('============================');

// Function to check pricing consistency
function checkPricingConsistency() {
  // Get the round pizza display total
  const roundPizzaTotal = document.querySelector('.text-red-600')?.textContent;
  
  // Get the cart button total
  const cartButtonTotal = document.querySelector('button')?.textContent?.match(/\$[\d.]+/)?.[0];
  
  // Get the selected size price from the panel
  const selectedSizePrice = document.querySelector('.border-red-500 .font-bold.text-red-600')?.textContent;
  
  console.log('Price Display Comparison:');
  console.log('========================');
  console.log('Round Pizza Display:', roundPizzaTotal);
  console.log('Cart Button:', cartButtonTotal);
  console.log('Selected Size Price:', selectedSizePrice);
  
  // Check for discrepancies
  if (roundPizzaTotal && cartButtonTotal) {
    const roundPrice = parseFloat(roundPizzaTotal.replace('$', ''));
    const cartPrice = parseFloat(cartButtonTotal.replace('$', ''));
    
    if (roundPrice === cartPrice) {
      console.log('✅ Round pizza and cart button prices MATCH');
    } else {
      console.log('❌ Round pizza and cart button prices DO NOT MATCH');
      console.log(`   Difference: $${Math.abs(roundPrice - cartPrice).toFixed(2)}`);
    }
  }
  
  // Additional debugging info
  console.log('\nDebugging Info:');
  console.log('===============');
  console.log('Specialty Pizza Name:', document.querySelector('h1')?.textContent);
  console.log('Selected Size:', document.querySelector('.border-red-500 .font-semibold')?.textContent);
  
  return {
    roundPizzaTotal,
    cartButtonTotal,
    selectedSizePrice
  };
}

// Auto-run the check
checkPricingConsistency();

// Provide helper function for manual testing
window.checkPricingConsistency = checkPricingConsistency;

console.log('\n💡 To recheck pricing after making changes, run: checkPricingConsistency()');
