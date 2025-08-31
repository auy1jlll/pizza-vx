// Quick test for specialty calzone API
fetch('http://localhost:3005/api/specialty-calzones/cmez5ncaz000kvkawt4u0qleq')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(data => {
    console.log('✅ SUCCESS: Specialty calzone API is working!');
    console.log('📦 Data received:', data.name);
  })
  .catch(error => {
    console.log('❌ ERROR:', error.message);
  });
