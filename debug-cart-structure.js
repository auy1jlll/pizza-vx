// Test script to check the exact cart data structure
console.log('🔍 CART DATA STRUCTURE TEST');
console.log('==========================');

// Instructions for the user
console.log('📋 To debug the cart display issue:');
console.log('');
console.log('1. Open your browser and go to http://localhost:3005');
console.log('2. Navigate to Menu > Dinner Plates');
console.log('3. Add "BBQ Ribs" to cart with customizations');
console.log('4. Open browser developer tools (F12)');
console.log('5. Go to Console tab');
console.log('6. Run this command:');
console.log('');
console.log('   localStorage.getItem("menuCart")');
console.log('');
console.log('7. Copy the output and paste it here to see the exact structure');
console.log('');
console.log('Expected output format:');
console.log('[{"id":"menu-...","name":"BBQ Ribs","customizations":[...]}]');
console.log('');
console.log('💡 The customizations array is what we need to examine to fix the display logic');

console.log('\n🔧 Based on your previous message, customizations appear to be:');
console.log('- "Bread Type: Small Sub Roll"');
console.log('- "Size: 6 inch"'); 
console.log('- "Bread Choice: White Sub Roll"');
console.log('');
console.log('This suggests they are simple strings, not objects with groupName/optionName');

console.log('\n✅ Once we confirm the structure, I can fix the checkout display logic');
