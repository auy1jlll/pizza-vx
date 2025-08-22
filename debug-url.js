// Debug script to check URL parameters when visiting build-pizza
console.log('Current URL:', window.location.href);
console.log('Search params:', new URLSearchParams(window.location.search));

const params = new URLSearchParams(window.location.search);
console.log('specialty:', params.get('specialty'));
console.log('size:', params.get('size'));
console.log('productType:', params.get('productType'));

// Check if specialty pizza exists and what type it is
const specialtyId = params.get('specialty');
if (specialtyId) {
  fetch(`/api/specialty-pizzas/${specialtyId}`)
    .then(res => res.json())
    .then(data => {
      console.log('Specialty pizza data:', data);
      console.log('Category:', data.category);
    });
}
