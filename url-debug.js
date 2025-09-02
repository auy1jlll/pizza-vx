// Debug test to check URL parameters
console.log('🔍 URL Debug Test');
console.log('Current URL:', window.location.href);
console.log('Search params:', window.location.search);
console.log('Hash:', window.location.hash);

// Parse URLSearchParams
const urlParams = new URLSearchParams(window.location.search);
console.log('All URL parameters:');
for (const [key, value] of urlParams) {
  console.log(`  ${key}: ${value}`);
}

// Check specifically for specialty
const specialty = urlParams.get('specialty');
console.log('Specialty parameter:', specialty);

// Check browser history
console.log('History length:', history.length);

// Check if there's anything in sessionStorage or localStorage
console.log('SessionStorage keys:', Object.keys(sessionStorage));
console.log('LocalStorage keys:', Object.keys(localStorage));

if (specialty) {
  console.log('❌ PROBLEM: specialty parameter found!', specialty);
} else {
  console.log('✅ GOOD: No specialty parameter');
}
