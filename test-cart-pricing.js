// Quick test to verify cart pricing API is working
console.log('🧪 Testing cart pricing API fix...');

fetch('http://localhost:3006/api/cart/refresh-prices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pizzaItems: [],
    menuItems: []
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('✅ Cart pricing API is working correctly!');
    console.log('Response:', data);
  } else {
    console.log('❌ Cart pricing API still has issues:', data);
  }
})
.catch(error => {
  console.error('❌ Network error:', error);
});
